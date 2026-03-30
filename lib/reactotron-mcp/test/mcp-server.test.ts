import { getPort } from "get-port-please"
import { createServer } from "reactotron-core-server"
import { createMcpServer } from "../src/mcp-server"
import WebSocket from "ws"
import http from "http"

// Helper: make an MCP JSON-RPC request
function mcpRequest(
  port: number,
  body: object
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const req = http.request(
      {
        hostname: "localhost",
        port,
        path: "/mcp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = ""
        res.on("data", (chunk) => (body += chunk))
        res.on("end", () => resolve({ status: res.statusCode!, body }))
      }
    )
    req.on("error", reject)
    req.write(data)
    req.end()
  })
}

// Helper: parse SSE response to get the JSON-RPC result
function parseSSE(body: string): any {
  const dataLine = body.split("\n").find((l) => l.startsWith("data: "))
  if (!dataLine) return null
  return JSON.parse(dataLine.replace("data: ", ""))
}

// Helper: connect a mock app to the relay
function connectMockApp(
  relayPort: number,
  appName = "TestApp"
): Promise<WebSocket> {
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://localhost:${relayPort}`)
    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "client.intro",
          payload: {
            name: appName,
            platform: "ios",
            platformVersion: "17.0",
            clientId: `${appName}-ios-test`,
          },
        })
      )
      // Give the relay time to process
      setTimeout(() => resolve(ws), 100)
    })
  })
}

let relayPort: number
let mcpPort: number
let relay: ReturnType<typeof createServer>
let mcp: ReturnType<typeof createMcpServer>

beforeEach(async () => {
  relayPort = await getPort({ random: true })
  mcpPort = await getPort({ random: true })
  relay = createServer({ port: relayPort })
  relay.start()
  mcp = createMcpServer(relay)
  mcp.start(mcpPort)
  // Wait for both servers to be ready
  await new Promise((r) => setTimeout(r, 200))
})

afterEach(() => {
  mcp.stop()
  relay.stop()
})

describe("MCP server lifecycle", () => {
  test("starts and reports as started", () => {
    expect(mcp.started).toBe(true)
    expect(mcp.port).toBe(mcpPort)
  })

  test("stops cleanly", () => {
    mcp.stop()
    expect(mcp.started).toBe(false)
    expect(mcp.port).toBe(null)
  })

  test("responds to MCP initialize", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "initialize",
      id: 1,
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0.0" },
      },
    })
    expect(res.status).toBe(200)
    const result = parseSSE(res.body)
    expect(result.result.serverInfo.name).toBe("reactotron")
  })

  test("rejects non-POST methods", async () => {
    const res = await new Promise<{ status: number }>((resolve, reject) => {
      const req = http.request(
        { hostname: "localhost", port: mcpPort, path: "/mcp", method: "GET" },
        (res) => {
          res.resume()
          res.on("end", () => resolve({ status: res.statusCode! }))
        }
      )
      req.on("error", reject)
      req.end()
    })
    expect(res.status).toBe(405)
  })

  test("returns 404 for unknown paths", async () => {
    const res = await new Promise<{ status: number }>((resolve, reject) => {
      const req = http.request(
        { hostname: "localhost", port: mcpPort, path: "/unknown", method: "POST" },
        (res) => {
          res.resume()
          res.on("end", () => resolve({ status: res.statusCode! }))
        }
      )
      req.on("error", reject)
      req.end()
    })
    expect(res.status).toBe(404)
  })
})

describe("resources", () => {
  test("lists resources", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "resources/list",
      id: 2,
      params: {},
    })
    const result = parseSSE(res.body)
    const names = result.result.resources.map((r: any) => r.name)
    expect(names).toContain("timeline")
    expect(names).toContain("apps")
    expect(names).toContain("state")
    expect(names).toContain("network")
    expect(names).toContain("benchmarks")
    expect(names).toContain("subscriptions")
    expect(names).toContain("asyncstorage")
  })

  test("reads apps resource with no connections", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "resources/read",
      id: 3,
      params: { uri: "reactotron://apps" },
    })
    const result = parseSSE(res.body)
    const data = JSON.parse(result.result.contents[0].text)
    expect(data._meta.connection).toBe("no_apps_connected")
    expect(data.apps).toEqual([])
  })

  test("reads apps resource with a connected app", async () => {
    const app = await connectMockApp(relayPort)
    try {
      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 4,
        params: { uri: "reactotron://apps" },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.contents[0].text)
      expect(data._meta.connection).toBe("single_app")
      expect(data.apps.length).toBe(1)
      expect(data.apps[0].name).toBe("TestApp")
    } finally {
      app.close()
    }
  })

  test("reads timeline with buffered events", async () => {
    const app = await connectMockApp(relayPort)
    try {
      // Send a log event from the mock app
      app.send(JSON.stringify({ type: "log", payload: { message: "hello" } }))
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 5,
        params: { uri: "reactotron://timeline" },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.contents[0].text)
      // Should have client.intro + log events
      expect(data.events.length).toBeGreaterThanOrEqual(2)
      const logEvent = data.events.find((e: any) => e.type === "log")
      expect(logEvent).toBeDefined()
      // Timeline events are now summarized — payload is replaced with payloadPreview
      expect(logEvent.payloadPreview).toContain("hello")
    } finally {
      app.close()
    }
  })

  test("reads empty state", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "resources/read",
      id: 6,
      params: { uri: "reactotron://state/current" },
    })
    const result = parseSSE(res.body)
    const data = JSON.parse(result.result.contents[0].text)
    expect(data.state.status).toBe("no_state_received")
  })

  test("reads asyncstorage mutations", async () => {
    const app = await connectMockApp(relayPort)
    try {
      app.send(
        JSON.stringify({
          type: "asyncStorage.mutation",
          payload: { action: "setItem", data: { key: "token", value: "abc123" } },
        })
      )
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 7,
        params: { uri: "reactotron://asyncstorage" },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.contents[0].text)
      expect(data.mutations.length).toBe(1)
      expect(data.mutations[0].action).toBe("setItem")
      expect(data.mutations[0].data.key).toBe("token")
    } finally {
      app.close()
    }
  })
})

describe("tools", () => {
  test("lists tools", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "tools/list",
      id: 10,
      params: {},
    })
    const result = parseSSE(res.body)
    const names = result.result.tools.map((t: any) => t.name)
    expect(names).toContain("dispatch_action")
    expect(names).toContain("request_state")
    expect(names).toContain("request_state_keys")
    expect(names).toContain("swap_state")
    expect(names).toContain("send_custom_command")
    expect(names).toContain("list_custom_commands")
    expect(names).toContain("show_overlay")
    expect(names).toContain("clear_timeline")
    expect(names).toContain("subscribe_state")
    expect(names).toContain("unsubscribe_state")
  })

  test("send_custom_command errors with no apps connected", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "tools/call",
      id: 11,
      params: { name: "send_custom_command", arguments: { command: "test" } },
    })
    const result = parseSSE(res.body)
    const data = JSON.parse(result.result.content[0].text)
    expect(data.status).toBe("error")
    expect(data.message).toContain("No apps connected")
  })

  test("send_custom_command sends to connected app", async () => {
    const app = await connectMockApp(relayPort)
    try {
      const received: any[] = []
      app.on("message", (msg) => {
        const parsed = JSON.parse(msg.toString())
        if (parsed.type === "custom") received.push(parsed)
      })

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 12,
        params: { name: "send_custom_command", arguments: { command: "ping" } },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("sent")
      expect(data.command).toBe("ping")

      await new Promise((r) => setTimeout(r, 100))
      expect(received.length).toBe(1)
      expect(received[0].payload.command).toBe("ping")
    } finally {
      app.close()
    }
  })

  test("list_custom_commands returns registered commands", async () => {
    const app = await connectMockApp(relayPort)
    try {
      app.send(
        JSON.stringify({
          type: "customCommand.register",
          payload: { id: 1, command: "reload", title: "Reload App" },
        })
      )
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 13,
        params: { name: "list_custom_commands", arguments: {} },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("success")
      expect(data.commands.length).toBe(1)
      expect(data.commands[0].command).toBe("reload")
    } finally {
      app.close()
    }
  })

  test("list_custom_commands returns commands registered before MCP started", async () => {
    // Stop MCP server, connect app and register commands, then restart MCP
    mcp.stop()

    const app = await connectMockApp(relayPort)
    try {
      app.send(
        JSON.stringify({
          type: "customCommand.register",
          payload: { id: 1, command: "navigateTo", title: "Navigate To Screen" },
        })
      )
      app.send(
        JSON.stringify({
          type: "customCommand.register",
          payload: { id: 2, command: "resetStore", title: "Reset Root Store" },
        })
      )
      await new Promise((r) => setTimeout(r, 100))

      // Now start MCP — commands were registered before it was listening
      const newMcpPort = await getPort({ random: true })
      mcp = createMcpServer(relay)
      await mcp.start(newMcpPort)
      await new Promise((r) => setTimeout(r, 200))

      const res = await mcpRequest(newMcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 30,
        params: { name: "list_custom_commands", arguments: {} },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("success")
      expect(data.commands.length).toBe(2)
      expect(data.commands.map((c: any) => c.command)).toEqual(["navigateTo", "resetStore"])
    } finally {
      app.close()
    }
  })

  test("clear_timeline clears the buffer", async () => {
    const app = await connectMockApp(relayPort)
    try {
      app.send(JSON.stringify({ type: "log", payload: { message: "test" } }))
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 14,
        params: { name: "clear_timeline", arguments: {} },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("cleared")
      expect(data.eventsRemoved).toBeGreaterThan(0)

      // Verify timeline is now empty
      const timelineRes = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 15,
        params: { uri: "reactotron://timeline" },
      })
      const timelineResult = parseSSE(timelineRes.body)
      const timelineData = JSON.parse(timelineResult.result.contents[0].text)
      expect(timelineData.events.length).toBe(0)
    } finally {
      app.close()
    }
  })

  test("request_state returns no_response when app has no state plugin", async () => {
    const app = await connectMockApp(relayPort)
    try {
      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 16,
        params: { name: "request_state", arguments: {} },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("no_response")
    } finally {
      app.close()
    }
  }, 10000)

  test("dispatch_action sends to connected app", async () => {
    const app = await connectMockApp(relayPort)
    try {
      const received: any[] = []
      app.on("message", (msg) => {
        const parsed = JSON.parse(msg.toString())
        if (parsed.type === "state.action.dispatch") received.push(parsed)
      })

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 17,
        params: {
          name: "dispatch_action",
          arguments: { actionType: "INCREMENT", actionPayload: { amount: 1 } },
        },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("dispatched")

      await new Promise((r) => setTimeout(r, 100))
      expect(received.length).toBe(1)
    } finally {
      app.close()
    }
  }, 10000)

  test("subscribe_state adds a subscription", async () => {
    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "tools/call",
      id: 18,
      params: { name: "subscribe_state", arguments: { path: "user.name" } },
    })
    const result = parseSSE(res.body)
    const data = JSON.parse(result.result.content[0].text)
    expect(data.status).toBe("subscribed")
    expect(data.path).toBe("user.name")
    expect(data.activeSubscriptions).toContain("user.name")
  })

  test("unsubscribe_state removes a subscription", async () => {
    // Subscribe first
    await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "tools/call",
      id: 19,
      params: { name: "subscribe_state", arguments: { path: "user.name" } },
    })

    const res = await mcpRequest(mcpPort, {
      jsonrpc: "2.0",
      method: "tools/call",
      id: 20,
      params: { name: "unsubscribe_state", arguments: { path: "user.name" } },
    })
    const result = parseSSE(res.body)
    const data = JSON.parse(result.result.content[0].text)
    expect(data.status).toBe("unsubscribed")
    expect(data.activeSubscriptions).not.toContain("user.name")
  })

  test("request_state_keys returns no_response when app has no state plugin", async () => {
    const app = await connectMockApp(relayPort)
    try {
      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 21,
        params: { name: "request_state_keys", arguments: { path: "" } },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.content[0].text)
      expect(data.status).toBe("no_response")
    } finally {
      app.close()
    }
  })
})

describe("timeline summarization", () => {
  test("timeline events have payloadPreview instead of full payload", async () => {
    const app = await connectMockApp(relayPort)
    try {
      app.send(JSON.stringify({
        type: "api.response",
        payload: {
          duration: 100,
          request: { method: "GET", url: "/api/users", data: null, headers: {}, params: {} },
          response: { status: 200, body: "x".repeat(10_000), headers: {} },
        },
      }))
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 30,
        params: { uri: "reactotron://timeline" },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.contents[0].text)
      const apiEvent = data.events.find((e: any) => e.type === "api.response")
      expect(apiEvent).toBeDefined()
      expect(apiEvent.payloadPreview).toBe("GET /api/users -> 200 (100ms)")
      // Full payload should NOT be present
      expect(apiEvent.payload).toBeUndefined()
    } finally {
      app.close()
    }
  })

  test("network resource returns summarized entries with truncated bodies", async () => {
    const app = await connectMockApp(relayPort)
    try {
      app.send(JSON.stringify({
        type: "api.response",
        payload: {
          duration: 50,
          request: { method: "POST", url: "/api/data", data: { key: "value" }, headers: {}, params: {} },
          response: { status: 201, body: "y".repeat(10_000), headers: {} },
        },
      }))
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 31,
        params: { uri: "reactotron://network/log" },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.contents[0].text)
      expect(data.entries.length).toBeGreaterThanOrEqual(1)
      const entry = data.entries.find((e: any) => e.request.url === "/api/data")
      expect(entry).toBeDefined()
      expect(entry.request.method).toBe("POST")
      expect(entry.response.status).toBe(201)
      expect(entry.duration).toBe(50)
      // Body should be truncated
      expect(entry.response.body.length).toBeLessThanOrEqual(503)
    } finally {
      app.close()
    }
  })

  test("timeline_by_type resource template returns filtered events with full payloads", async () => {
    const app = await connectMockApp(relayPort)
    try {
      app.send(JSON.stringify({ type: "log", payload: { message: "test log" } }))
      app.send(JSON.stringify({
        type: "api.response",
        payload: {
          duration: 50,
          request: { method: "GET", url: "/api/test", data: null, headers: {}, params: {} },
          response: { status: 200, body: "ok", headers: {} },
        },
      }))
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 32,
        params: { uri: "reactotron://timeline/log" },
      })
      const result = parseSSE(res.body)
      const data = JSON.parse(result.result.contents[0].text)
      expect(data.type).toBe("log")
      // Should only have log events (plus possibly other log events from connection)
      expect(data.events.every((e: any) => e.type === "log")).toBe(true)
      // Should have full payload, not just preview
      const logEvent = data.events.find((e: any) => e.payload?.message === "test log")
      expect(logEvent).toBeDefined()
    } finally {
      app.close()
    }
  })
})

describe("large response truncation", () => {
  test("request_state truncates oversized state with guidance message", async () => {
    const app = await connectMockApp(relayPort)
    try {
      // Mock app replies to state.values.request with a huge state tree
      app.on("message", (msg) => {
        const parsed = JSON.parse(msg.toString())
        if (parsed.type === "state.values.request") {
          // Build a state tree that exceeds MAX_RESPONSE_CHARS (800K)
          const bigState: Record<string, any> = {}
          for (let i = 0; i < 2000; i++) {
            bigState[`key_${i}`] = {
              id: i,
              data: "x".repeat(500),
              nested: { a: { b: { c: `value-${i}` } } },
            }
          }
          app.send(JSON.stringify({
            type: "state.values.response",
            payload: { path: "", value: bigState, valid: true },
          }))
        }
      })

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "tools/call",
        id: 40,
        params: { name: "request_state", arguments: {} },
      })
      const result = parseSSE(res.body)
      const text = result.result.content[0].text

      // Should be truncated to MAX_RESPONSE_CHARS (800K)
      expect(text.length).toBeLessThanOrEqual(800_000)
      // Should contain the truncation guidance message
      expect(text).toContain("[TRUNCATED")
      expect(text).toContain("request_state")
      expect(text).toContain("path")
    } finally {
      app.close()
    }
  }, 10000)

  test("state resource truncates oversized cached state with guidance message", async () => {
    const app = await connectMockApp(relayPort)
    try {
      // Inject a huge state.values.response directly into the buffer
      const bigState: Record<string, any> = {}
      for (let i = 0; i < 2000; i++) {
        bigState[`key_${i}`] = { data: "y".repeat(500) }
      }
      app.send(JSON.stringify({
        type: "state.values.response",
        payload: { path: "", value: bigState, valid: true },
      }))
      await new Promise((r) => setTimeout(r, 100))

      const res = await mcpRequest(mcpPort, {
        jsonrpc: "2.0",
        method: "resources/read",
        id: 41,
        params: { uri: "reactotron://state/current" },
      })
      const result = parseSSE(res.body)
      const text = result.result.contents[0].text

      expect(text.length).toBeLessThanOrEqual(800_000)
      expect(text).toContain("[TRUNCATED")
      expect(text).toContain("request_state")
    } finally {
      app.close()
    }
  })
})
