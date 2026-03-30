import {
  compactJson,
  truncate,
  safeSerialize,
  summarizeCommand,
  summarizeNetworkEntry,
  MAX_RESPONSE_CHARS,
  MAX_PAYLOAD_PREVIEW_CHARS,
} from "../src/serialization"
import type { Command } from "reactotron-core-contract"

function makeCommand(overrides: Partial<Command> = {}): Command {
  return {
    type: "log",
    connectionId: 1,
    clientId: "abc-123",
    date: new Date("2025-01-01T00:00:00Z"),
    deltaTime: 0,
    important: false,
    messageId: 1,
    payload: { message: "hello" },
    ...overrides,
  } as Command
}

describe("compactJson", () => {
  test("produces no whitespace indentation", () => {
    const data = { a: { b: { c: [1, 2, 3] } } }
    const result = compactJson(data)
    expect(result).toBe('{"a":{"b":{"c":[1,2,3]}}}')
    expect(result).not.toContain("\n")
    expect(result).not.toContain("  ")
  })

  test("handles primitives", () => {
    expect(compactJson("hello")).toBe('"hello"')
    expect(compactJson(42)).toBe("42")
    expect(compactJson(null)).toBe("null")
    expect(compactJson(true)).toBe("true")
  })
})

describe("truncate", () => {
  test("returns original string when under limit", () => {
    const text = "short string"
    expect(truncate(text, 1000)).toBe(text)
  })

  test("truncates with default message when over limit", () => {
    const text = "x".repeat(200)
    const result = truncate(text, 100)
    expect(result.length).toBeLessThanOrEqual(100)
    expect(result).toContain("[TRUNCATED")
  })

  test("truncates with custom guidance message", () => {
    const text = "x".repeat(200)
    const result = truncate(text, 100, "Use path='user' for a smaller response.")
    expect(result).toContain("Use path='user'")
    expect(result).toContain("[TRUNCATED")
  })
})

describe("safeSerialize", () => {
  test("returns compact JSON for small objects", () => {
    const data = { status: "ok", count: 5 }
    const result = safeSerialize(data)
    expect(result).toBe('{"status":"ok","count":5}')
  })

  test("truncates large objects with guidance", () => {
    const data = { big: "x".repeat(1_000_000) }
    const result = safeSerialize(data, 10_000, "Try a smaller query.")
    expect(result.length).toBeLessThanOrEqual(10_000)
    expect(result).toContain("[TRUNCATED")
    expect(result).toContain("Try a smaller query.")
  })

  test("uses MAX_RESPONSE_CHARS as default limit", () => {
    const data = { big: "x".repeat(MAX_RESPONSE_CHARS + 100_000) }
    const result = safeSerialize(data)
    expect(result.length).toBeLessThanOrEqual(MAX_RESPONSE_CHARS)
  })
})

describe("summarizeCommand", () => {
  test("keeps metadata fields and strips payload", () => {
    const cmd = makeCommand({
      payload: { message: "hello", extraData: "x".repeat(10_000) },
    })
    const summary = summarizeCommand(cmd) as any
    expect(summary.type).toBe("log")
    expect(summary.clientId).toBe("abc-123")
    expect(summary.messageId).toBe(1)
    expect(summary.date).toEqual(new Date("2025-01-01T00:00:00Z"))
    expect(summary.payloadPreview).toBeDefined()
    expect(summary.payload).toBeUndefined()
  })

  test("produces one-liner for api.response", () => {
    const cmd = makeCommand({
      type: "api.response" as any,
      payload: {
        duration: 145,
        request: { method: "GET", url: "/api/users", data: null, headers: {}, params: {} },
        response: { status: 200, body: "x".repeat(50_000), headers: {} },
      },
    })
    const summary = summarizeCommand(cmd) as any
    expect(summary.payloadPreview).toBe("GET /api/users -> 200 (145ms)")
  })

  test("produces preview for log events", () => {
    const cmd = makeCommand({
      type: "log" as any,
      payload: { level: "error", message: "Something went wrong" },
    })
    const summary = summarizeCommand(cmd) as any
    expect(summary.payloadPreview).toBe("[error] Something went wrong")
  })

  test("produces preview for state.values.response", () => {
    const cmd = makeCommand({
      type: "state.values.response" as any,
      payload: { path: "user.profile", value: { name: "Alice" }, valid: true },
    })
    const summary = summarizeCommand(cmd) as any
    expect(summary.payloadPreview).toBe("path: user.profile")
  })

  test("truncates large generic payloads", () => {
    const cmd = makeCommand({
      type: "display" as any,
      payload: { name: "test", value: "x".repeat(10_000) },
    })
    const summary = summarizeCommand(cmd) as any
    expect(summary.payloadPreview.length).toBeLessThanOrEqual(MAX_PAYLOAD_PREVIEW_CHARS + 3) // +3 for "..."
  })
})

describe("summarizeNetworkEntry", () => {
  test("keeps URL, method, status, duration", () => {
    const cmd = makeCommand({
      type: "api.response" as any,
      payload: {
        duration: 200,
        request: { method: "POST", url: "/api/data", data: { key: "value" }, headers: { "Content-Type": "application/json" }, params: {} },
        response: { status: 201, body: '{"id":1}', headers: {} },
      },
    })
    const entry = summarizeNetworkEntry(cmd) as any
    expect(entry.request.method).toBe("POST")
    expect(entry.request.url).toBe("/api/data")
    expect(entry.response.status).toBe(201)
    expect(entry.duration).toBe(200)
  })

  test("truncates large response bodies", () => {
    const cmd = makeCommand({
      type: "api.response" as any,
      payload: {
        duration: 50,
        request: { method: "GET", url: "/api/big", data: null, headers: {}, params: {} },
        response: { status: 200, body: "x".repeat(10_000), headers: {} },
      },
    })
    const entry = summarizeNetworkEntry(cmd) as any
    expect(entry.response.body.length).toBeLessThanOrEqual(503) // 500 + "..."
  })

  test("truncates large request data", () => {
    const cmd = makeCommand({
      type: "api.response" as any,
      payload: {
        duration: 50,
        request: { method: "POST", url: "/api/upload", data: { big: "x".repeat(10_000) }, headers: {}, params: {} },
        response: { status: 200, body: "ok", headers: {} },
      },
    })
    const entry = summarizeNetworkEntry(cmd) as any
    expect(entry.request.data.length).toBeLessThanOrEqual(503)
  })
})
