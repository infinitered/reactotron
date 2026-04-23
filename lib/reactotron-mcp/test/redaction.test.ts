import {
  redact,
  resolveEffectiveRules,
  DEFAULT_REDACTION_RULES,
  DEFAULT_SERVER_CONFIG,
  REDACTED,
  type McpRedactionServerConfig,
} from "../src/redaction"
import type { McpRedactionRules, McpRedactionConfig } from "reactotron-core-contract"

describe("redact()", () => {
  const rules: McpRedactionRules = {
    headerNames: ["authorization", "cookie"],
    sensitiveKeys: ["password", "secret", "api_key"],
    statePathPatterns: ["auth.tokens.*", "user.ssn"],
    valuePatterns: [
      "Bearer\\s+[A-Za-z0-9\\-._~+/]+=*",
      "eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}",
    ],
  }

  test("redacts sensitive key names (case-insensitive)", () => {
    const data = { username: "alice", Password: "s3cret", SECRET: "abc" }
    const result = redact(data, rules) as any
    expect(result.username).toBe("alice")
    expect(result.Password).toBe(REDACTED)
    expect(result.SECRET).toBe(REDACTED)
  })

  test("redacts nested sensitive keys", () => {
    const data = { user: { name: "alice", password: "s3cret" } }
    const result = redact(data, rules) as any
    expect(result.user.name).toBe("alice")
    expect(result.user.password).toBe(REDACTED)
  })

  test("redacts header names in objects under 'headers' keys", () => {
    const data = {
      request: {
        url: "/api/data",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer abc123",
          Cookie: "session=xyz",
        },
      },
    }
    const result = redact(data, rules) as any
    expect(result.request.headers["Content-Type"]).toBe("application/json")
    expect(result.request.headers.Authorization).toBe(REDACTED)
    expect(result.request.headers.Cookie).toBe(REDACTED)
  })

  test("redacts values matching value patterns", () => {
    const data = {
      message: "Token is Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0 and more",
    }
    const result = redact(data, rules) as any
    expect(result.message).not.toContain("Bearer")
    expect(result.message).toContain(REDACTED)
    expect(result.message).toContain("and more")
  })

  test("redacts JWT-like values", () => {
    const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0"
    const data = { token: jwt, label: "test" }
    const result = redact(data, rules) as any
    expect(result.token).toBe(REDACTED)
    expect(result.label).toBe("test")
  })

  test("redacts state paths matching patterns", () => {
    const data = {
      auth: {
        tokens: {
          access: "abc",
          refresh: "def",
        },
        username: "alice",
      },
      user: {
        ssn: "123-45-6789",
        name: "Alice",
      },
    }
    const result = redact(data, rules) as any
    expect(result.auth.tokens.access).toBe(REDACTED)
    expect(result.auth.tokens.refresh).toBe(REDACTED)
    expect(result.auth.username).toBe("alice")
    expect(result.user.ssn).toBe(REDACTED)
    expect(result.user.name).toBe("Alice")
  })

  test("handles null and undefined values", () => {
    expect(redact(null, rules)).toBeNull()
    expect(redact(undefined, rules)).toBeUndefined()
    const data = { key: null, other: undefined, password: "secret" }
    const result = redact(data, rules) as any
    expect(result.key).toBeNull()
    expect(result.other).toBeUndefined()
    expect(result.password).toBe(REDACTED)
  })

  test("handles arrays", () => {
    const data = [
      { password: "s3cret", name: "alice" },
      { password: "p4ss", name: "bob" },
    ]
    const result = redact(data, rules) as any[]
    expect(result[0].password).toBe(REDACTED)
    expect(result[0].name).toBe("alice")
    expect(result[1].password).toBe(REDACTED)
    expect(result[1].name).toBe("bob")
  })

  test("handles circular references", () => {
    const data: any = { name: "alice", password: "secret" }
    data.self = data
    const result = redact(data, rules) as any
    expect(result.name).toBe("alice")
    expect(result.password).toBe(REDACTED)
    expect(result.self._circular).toBe(REDACTED)
  })

  test("handles primitives (string, number, boolean)", () => {
    expect(redact(42, rules)).toBe(42)
    expect(redact(true, rules)).toBe(true)
    expect(redact("plain text", rules)).toBe("plain text")
  })

  test("applies value pattern matching to non-header string values", () => {
    const data = { log: "Got Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0 from server" }
    const result = redact(data, rules) as any
    expect(result.log).not.toContain("Bearer")
    expect(result.log).toContain("from server")
  })

  test("redacts sensitive query parameters in URLs", () => {
    const rulesWithKey: McpRedactionRules = {
      ...rules,
      sensitiveKeys: [...(rules.sensitiveKeys ?? []), "key", "token"],
    }
    const data = {
      request: {
        url: "https://api.example.com/games?key=14e7149770cd4fdf&other=visible",
      },
    }
    const result = redact(data, rulesWithKey) as any
    expect(result.request.url).toBe(`https://api.example.com/games?key=${REDACTED}&other=visible`)
  })

  test("redacts multiple sensitive query parameters", () => {
    const rulesWithKey: McpRedactionRules = {
      ...rules,
      sensitiveKeys: [...(rules.sensitiveKeys ?? []), "key", "token"],
    }
    const data = { url: "https://api.example.com/data?key=abc&token=xyz&page=1" }
    const result = redact(data, rulesWithKey) as any
    expect(result.url).toBe(`https://api.example.com/data?key=${REDACTED}&token=${REDACTED}&page=1`)
  })

  test("does not redact query params when no sensitiveKeys match", () => {
    const data = { url: "https://api.example.com/data?page=1&limit=10" }
    const result = redact(data, rules) as any
    expect(result.url).toBe("https://api.example.com/data?page=1&limit=10")
  })

  test("does not redact non-matching keys or values", () => {
    const data = { username: "alice", email: "alice@example.com", count: 42 }
    const result = redact(data, rules) as any
    expect(result).toEqual(data)
  })

  test("redacts api_key with underscore style", () => {
    const data = { api_key: "sk-abc123", name: "test" }
    const result = redact(data, rules) as any
    expect(result.api_key).toBe(REDACTED)
    expect(result.name).toBe("test")
  })

  test("returns empty rules when no rules match", () => {
    const emptyRules: McpRedactionRules = {
      headerNames: [],
      sensitiveKeys: [],
      statePathPatterns: [],
      valuePatterns: [],
    }
    const data = { password: "secret", headers: { Authorization: "Bearer xyz" } }
    const result = redact(data, emptyRules) as any
    expect(result.password).toBe("secret")
    expect(result.headers.Authorization).toBe("Bearer xyz")
  })

  test("arrays inside objects with sensitive values", () => {
    const data = {
      users: [
        { name: "alice", password: "s1" },
        { name: "bob", secret: "s2" },
      ],
    }
    const result = redact(data, rules) as any
    expect(result.users[0].password).toBe(REDACTED)
    expect(result.users[1].secret).toBe(REDACTED)
  })
})

describe("resolveEffectiveRules()", () => {
  test("returns server defaults when no client config", () => {
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG)
    expect(result).toEqual(DEFAULT_SERVER_CONFIG.defaults)
  })

  test("returns server defaults when client config is empty", () => {
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, {})
    expect(result).toEqual(DEFAULT_SERVER_CONFIG.defaults)
  })

  test("merges additional rules from client", () => {
    const clientConfig: McpRedactionConfig = {
      additionalRules: {
        sensitiveKeys: ["myCustomField"],
        headerNames: ["x-custom-auth"],
      },
    }
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)!
    expect(result.sensitiveKeys).toContain("myCustomField")
    expect(result.sensitiveKeys).toContain("password") // default still present
    expect(result.headerNames).toContain("x-custom-auth")
    expect(result.headerNames).toContain("authorization") // default still present
  })

  test("ignores removeRules when server disallows", () => {
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        headerNames: ["authorization"],
      },
    }
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)!
    expect(result.headerNames).toContain("authorization")
  })

  test("honors removeRules when server allows", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientRemoveRules: true,
    }
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        headerNames: ["authorization"],
      },
    }
    const result = resolveEffectiveRules(serverConfig, clientConfig)!
    expect(result.headerNames).not.toContain("authorization")
    // Other defaults should remain
    expect(result.headerNames).toContain("cookie")
  })

  test("ignores disableRedaction when server disallows", () => {
    const clientConfig: McpRedactionConfig = {
      disableRedaction: true,
    }
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)
    expect(result).toEqual(DEFAULT_SERVER_CONFIG.defaults)
  })

  test("returns null when disableRedaction is true and server allows", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientDisable: true,
    }
    const clientConfig: McpRedactionConfig = {
      disableRedaction: true,
    }
    const result = resolveEffectiveRules(serverConfig, clientConfig)
    expect(result).toBeNull()
  })

  test("removeRules and additionalRules can be combined", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientRemoveRules: true,
    }
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        sensitiveKeys: ["password"],
      },
      additionalRules: {
        sensitiveKeys: ["mySecret"],
      },
    }
    const result = resolveEffectiveRules(serverConfig, clientConfig)!
    expect(result.sensitiveKeys).not.toContain("password")
    expect(result.sensitiveKeys).toContain("mySecret")
    expect(result.sensitiveKeys).toContain("secret") // other defaults intact
  })

  test("removeRules are case-insensitive for header names and sensitive keys", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientRemoveRules: true,
    }
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        headerNames: ["AUTHORIZATION"],
        sensitiveKeys: ["PASSWORD"],
      },
    }
    const result = resolveEffectiveRules(serverConfig, clientConfig)!
    expect(result.headerNames).not.toContain("authorization")
    expect(result.sensitiveKeys).not.toContain("password")
  })
})

describe("DEFAULT_REDACTION_RULES", () => {
  test("has expected default header names", () => {
    expect(DEFAULT_REDACTION_RULES.headerNames).toContain("authorization")
    expect(DEFAULT_REDACTION_RULES.headerNames).toContain("cookie")
    expect(DEFAULT_REDACTION_RULES.headerNames).toContain("set-cookie")
    expect(DEFAULT_REDACTION_RULES.headerNames).toContain("x-api-key")
  })

  test("has expected default sensitive keys", () => {
    expect(DEFAULT_REDACTION_RULES.sensitiveKeys).toContain("password")
    expect(DEFAULT_REDACTION_RULES.sensitiveKeys).toContain("secret")
    expect(DEFAULT_REDACTION_RULES.sensitiveKeys).toContain("access_token")
  })

  test("value patterns match common token formats", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }

    // Bearer token
    const bearerResult = redact("Bearer abc123def456", rules)
    expect(bearerResult).toBe(REDACTED)

    // OpenAI key
    const openaiResult = redact("sk-abcdefghijklmnopqrstuvwxyz", rules)
    expect(openaiResult).toBe(REDACTED)

    // GitHub PAT
    const ghpResult = redact("ghp_abcdefghijklmnopqrstuvwxyz1234567", rules)
    expect(ghpResult).toBe(REDACTED)

    // Slack token
    const slackResult = redact("xoxb-abc123-def456-ghi789", rules)
    expect(slackResult).toBe(REDACTED)

    // Non-matching string
    const plainResult = redact("hello world", rules)
    expect(plainResult).toBe("hello world")
  })
})
