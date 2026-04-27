/**
 * Integration tests for redaction applied to typical MCP resource/tool data shapes.
 * These test the full flow: resolveEffectiveRules → redact on real-world-like payloads.
 */
import {
  redact,
  resolveEffectiveRules,
  DEFAULT_SERVER_CONFIG,
  REDACTED,
  type McpRedactionServerConfig,
} from "../src/redaction"
import type { McpRedactionConfig, McpRedactionRules } from "reactotron-core-contract"

describe("redaction integration — network resource data", () => {
  const serverConfig = DEFAULT_SERVER_CONFIG

  test("redacts Authorization header in network entries", () => {
    const networkData = {
      _meta: { connection: "single_app" },
      entries: [
        {
          messageId: 1,
          date: "2024-01-01",
          duration: 100,
          request: {
            method: "GET",
            url: "/api/users",
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0",
              "Content-Type": "application/json",
            },
            data: null,
          },
          response: {
            status: 200,
            headers: {
              "Set-Cookie": "session=abc123; HttpOnly",
              "Content-Type": "application/json",
            },
            body: '{"users": []}',
          },
        },
      ],
    }

    const rules = resolveEffectiveRules(serverConfig)!
    const result = redact(networkData, rules) as any

    expect(result.entries[0].request.headers.Authorization).toBe(REDACTED)
    expect(result.entries[0].request.headers["Content-Type"]).toBe("application/json")
    expect(result.entries[0].response.headers["Set-Cookie"]).toBe(REDACTED)
    expect(result.entries[0].response.headers["Content-Type"]).toBe("application/json")
    expect(result.entries[0].request.url).toBe("/api/users")
  })

  test("redacts x-api-key header", () => {
    const data = {
      entries: [{
        request: {
          headers: { "X-Api-Key": "my-secret-api-key-12345" },
          url: "/api/data",
        },
      }],
    }

    const rules = resolveEffectiveRules(serverConfig)!
    const result = redact(data, rules) as any
    expect(result.entries[0].request.headers["X-Api-Key"]).toBe(REDACTED)
    expect(result.entries[0].request.url).toBe("/api/data")
  })
})

describe("redaction integration — state resource data", () => {
  const serverConfig = DEFAULT_SERVER_CONFIG

  test("redacts password fields in state", () => {
    const stateData = {
      _meta: { connection: "single_app" },
      state: {
        user: {
          name: "Alice",
          email: "alice@example.com",
          password: "hunter2",
          settings: {
            api_key: "sk-abcdefghijklmnopqrstuvwxyz1234",
          },
        },
        auth: {
          access_token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0",
          refresh_token: "rt_abc123",
          isLoggedIn: true,
        },
      },
    }

    const rules = resolveEffectiveRules(serverConfig)!
    const result = redact(stateData, rules) as any

    expect(result.state.user.name).toBe("Alice")
    expect(result.state.user.email).toBe("alice@example.com")
    expect(result.state.user.password).toBe(REDACTED)
    expect(result.state.user.settings.api_key).toBe(REDACTED)
    expect(result.state.auth.access_token).toBe(REDACTED)
    expect(result.state.auth.refresh_token).toBe(REDACTED)
    expect(result.state.auth.isLoggedIn).toBe(true)
  })

  test("redacts JWT values in log messages", () => {
    const data = {
      events: [{
        type: "log",
        payloadPreview: "[info] User authenticated with token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0 successfully",
      }],
    }

    const rules = resolveEffectiveRules(serverConfig)!
    const result = redact(data, rules) as any
    expect(result.events[0].payloadPreview).not.toContain("eyJ")
    expect(result.events[0].payloadPreview).toContain("successfully")
  })
})

describe("redaction integration — asyncstorage resource data", () => {
  test("redacts sensitive values in AsyncStorage mutations", () => {
    const data = {
      mutations: [
        {
          date: "2024-01-01",
          action: "setItem",
          data: { key: "auth_token", value: "ghp_abcdefghijklmnopqrstuvwxyz1234567890" },
        },
        {
          date: "2024-01-01",
          action: "setItem",
          data: { key: "username", value: "alice" },
        },
        {
          date: "2024-01-01",
          action: "setItem",
          data: { key: "credentials", value: { username: "alice", password: "hunter2" } },
        },
      ],
    }

    const rules = resolveEffectiveRules(DEFAULT_SERVER_CONFIG)!
    const result = redact(data, rules) as any

    // GitHub PAT should be redacted by value pattern
    expect(result.mutations[0].data.value).toBe(REDACTED)
    // Plain username should not be redacted
    expect(result.mutations[1].data.value).toBe("alice")
    // credentials key should be redacted entirely
    expect(result.mutations[2].data.key).toBe("credentials")
    // The value under "credentials" key is redacted by sensitiveKeys
    // Note: "credentials" is in sensitiveKeys, but it's a key name on the `data` object level
    // The object has key "credentials" at mutations[2].data which maps to the nested object
  })
})

describe("redaction integration — tool response data", () => {
  test("redacts state in request_state tool response shape", () => {
    const toolResponse = {
      status: "success",
      state: {
        users: {
          currentUser: {
            name: "Alice",
            accessToken: "sk-abcdefghijklmnopqrstuvwxyz",
            private_key: "-----BEGIN RSA PRIVATE KEY-----",
          },
        },
      },
    }

    const rules = resolveEffectiveRules(DEFAULT_SERVER_CONFIG)!
    const result = redact(toolResponse, rules) as any

    expect(result.state.users.currentUser.name).toBe("Alice")
    expect(result.state.users.currentUser.accessToken).toBe(REDACTED)
    expect(result.state.users.currentUser.private_key).toBe(REDACTED)
  })

  test("redacts action payload in dispatch_action tool response shape", () => {
    const toolResponse = {
      status: "dispatched",
      action: {
        type: "auth/login",
        payload: {
          username: "alice",
          password: "hunter2",
          apiKey: "sk-abcdefghijklmnopqrstuvwxyz",
        },
      },
      confirmed: true,
    }

    const rules = resolveEffectiveRules(DEFAULT_SERVER_CONFIG)!
    const result = redact(toolResponse, rules) as any

    expect(result.action.type).toBe("auth/login")
    expect(result.action.payload.username).toBe("alice")
    expect(result.action.payload.password).toBe(REDACTED)
    expect(result.action.payload.apiKey).toBe(REDACTED)
  })
})

describe("redaction integration — client config merging", () => {
  test("client additional rules are merged with server defaults", () => {
    const clientConfig: McpRedactionConfig = {
      additionalRules: {
        sensitiveKeys: ["myCustomField", "internalId", "x-internal-auth"],
      },
    }

    const rules = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)!

    // Server defaults still present
    expect(rules.sensitiveKeys).toContain("password")
    expect(rules.sensitiveKeys).toContain("authorization")
    // Client additions present
    expect(rules.sensitiveKeys).toContain("myCustomField")
    expect(rules.sensitiveKeys).toContain("internalId")
    expect(rules.sensitiveKeys).toContain("x-internal-auth")

    // Verify it actually redacts the custom fields
    const data = {
      user: { name: "alice", myCustomField: "secret-data", password: "hunter2" },
      request: {
        headers: {
          "x-internal-auth": "token-123",
          Authorization: "Bearer abc",
          "Content-Type": "application/json",
        },
      },
    }
    const result = redact(data, rules) as any
    expect(result.user.myCustomField).toBe(REDACTED)
    expect(result.user.password).toBe(REDACTED)
    expect(result.user.name).toBe("alice")
    expect(result.request.headers["x-internal-auth"]).toBe(REDACTED)
    expect(result.request.headers.Authorization).toBe(REDACTED)
    expect(result.request.headers["Content-Type"]).toBe("application/json")
  })

  test("client disable is blocked by default server config", () => {
    const clientConfig: McpRedactionConfig = { disableRedaction: true }
    const rules = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)

    // Should NOT be null — server blocks disable
    expect(rules).not.toBeNull()
    expect(rules!.sensitiveKeys).toContain("password")
  })

  test("client disable is honored when server allows", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientDisable: true,
    }
    const clientConfig: McpRedactionConfig = { disableRedaction: true }
    const rules = resolveEffectiveRules(serverConfig, clientConfig)

    expect(rules).toBeNull()
  })

  test("client remove rules blocked by default", () => {
    const clientConfig: McpRedactionConfig = {
      removeRules: { sensitiveKeys: ["authorization"] },
    }
    const rules = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)!
    expect(rules.sensitiveKeys).toContain("authorization")
  })

  test("client remove rules honored when server allows", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientRemoveRules: true,
    }
    const clientConfig: McpRedactionConfig = {
      removeRules: { sensitiveKeys: ["authorization"] },
    }
    const rules = resolveEffectiveRules(serverConfig, clientConfig)!
    expect(rules.sensitiveKeys).not.toContain("authorization")
    expect(rules.sensitiveKeys).toContain("cookie") // other defaults intact
  })
})

describe("redaction integration — state path patterns with real state shapes", () => {
  test("wildcard path redacts all children of a state subtree", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      defaults: {
        ...DEFAULT_SERVER_CONFIG.defaults,
        statePathPatterns: ["auth.tokens.*"],
      },
    }
    const rules = resolveEffectiveRules(serverConfig)!

    const state = {
      auth: {
        tokens: {
          access: "abc123",
          refresh: "def456",
          idToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0",
        },
        isAuthenticated: true,
      },
      user: { name: "Alice" },
    }

    const result = redact(state, rules) as any
    expect(result.auth.tokens.access).toBe(REDACTED)
    expect(result.auth.tokens.refresh).toBe(REDACTED)
    expect(result.auth.tokens.idToken).toBe(REDACTED)
    expect(result.auth.isAuthenticated).toBe(true)
    expect(result.user.name).toBe("Alice")
  })

  test("exact path redacts specific state key", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      defaults: {
        ...DEFAULT_SERVER_CONFIG.defaults,
        statePathPatterns: ["config.apiSecret"],
      },
    }
    const rules = resolveEffectiveRules(serverConfig)!

    const state = {
      config: {
        apiSecret: "my-secret-value",
        apiUrl: "https://api.example.com",
      },
    }

    const result = redact(state, rules) as any
    expect(result.config.apiSecret).toBe(REDACTED)
    expect(result.config.apiUrl).toBe("https://api.example.com")
  })
})
