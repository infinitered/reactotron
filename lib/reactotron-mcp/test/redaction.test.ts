import {
  redact,
  redactAsyncStorageData,
  resolveEffectiveRules,
  createRedactor,
  DEFAULT_REDACTION_RULES,
  DEFAULT_SERVER_CONFIG,
  REDACTED,
  type McpRedactionServerConfig,
} from "../src/redaction"
import type { McpRedactionRules, McpRedactionConfig } from "reactotron-core-contract"

describe("redact()", () => {
  const rules: McpRedactionRules = {
    sensitiveKeys: ["password", "secret", "api_key", "authorization", "cookie"],
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

  test("redacts header names anywhere they appear, not just under 'headers' keys", () => {
    // Real-world leak path: redux state caches an API response under a non-canonical
    // key (requestHeaders / lastResponse / etc.) — header-name rules must still fire,
    // because Cookie values like "session=xyz" don't match any default value pattern.
    const data = {
      lastResponse: {
        requestHeaders: {
          Authorization: "Bearer abc123",
          Cookie: "session=xyz",
          "Content-Type": "application/json",
        },
      },
    }
    const result = redact(data, rules) as any
    expect(result.lastResponse.requestHeaders.Authorization).toBe(REDACTED)
    expect(result.lastResponse.requestHeaders.Cookie).toBe(REDACTED)
    expect(result.lastResponse.requestHeaders["Content-Type"]).toBe("application/json")
  })

  test("redacts a Set-Cookie array value (not just string)", () => {
    // Pre-unification regression: when headers had a separate code path, only
    // string values got redacted — an array of cookies under Set-Cookie slipped
    // through. Universal-key matching now drops the whole value at the key.
    const data = {
      headers: {
        "Set-Cookie": ["session=xyz; HttpOnly", "remember=1"],
      },
    }
    const setCookieRules: McpRedactionRules = {
      sensitiveKeys: ["set-cookie"],
      valuePatterns: [],
    }
    const result = redact(data, setCookieRules) as any
    expect(result.headers["Set-Cookie"]).toBe(REDACTED)
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
        sensitiveKeys: ["myCustomField", "x-custom-auth"],
      },
    }
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)!
    expect(result.sensitiveKeys).toContain("myCustomField")
    expect(result.sensitiveKeys).toContain("x-custom-auth")
    expect(result.sensitiveKeys).toContain("password") // default still present
    expect(result.sensitiveKeys).toContain("authorization") // default header still present
  })

  test("ignores removeRules when server disallows", () => {
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        sensitiveKeys: ["authorization"],
      },
    }
    const result = resolveEffectiveRules(DEFAULT_SERVER_CONFIG, clientConfig)!
    expect(result.sensitiveKeys).toContain("authorization")
  })

  test("honors removeRules when server allows", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientRemoveRules: true,
    }
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        sensitiveKeys: ["authorization"],
      },
    }
    const result = resolveEffectiveRules(serverConfig, clientConfig)!
    expect(result.sensitiveKeys).not.toContain("authorization")
    // Other defaults should remain
    expect(result.sensitiveKeys).toContain("cookie")
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

  test("removeRules are case-insensitive", () => {
    const serverConfig: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      allowClientRemoveRules: true,
    }
    const clientConfig: McpRedactionConfig = {
      removeRules: {
        sensitiveKeys: ["AUTHORIZATION", "PASSWORD"],
      },
    }
    const result = resolveEffectiveRules(serverConfig, clientConfig)!
    expect(result.sensitiveKeys).not.toContain("authorization")
    expect(result.sensitiveKeys).not.toContain("password")
  })
})

describe("DEFAULT_REDACTION_RULES", () => {
  test("has expected default HTTP header names in sensitiveKeys", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("authorization")
    expect(keys).toContain("cookie")
    expect(keys).toContain("set-cookie")
    expect(keys).toContain("x-api-key")
  })

  test("includes CSRF/XSRF header variants", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("x-csrf-token")
    expect(keys).toContain("x-xsrf-token")
    expect(keys).toContain("csrf-token")
  })

  test("includes IP-forwarding PII headers", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("x-forwarded-for")
    expect(keys).toContain("x-real-ip")
  })

  test("has expected default sensitive keys", () => {
    expect(DEFAULT_REDACTION_RULES.sensitiveKeys).toContain("password")
    expect(DEFAULT_REDACTION_RULES.sensitiveKeys).toContain("secret")
    expect(DEFAULT_REDACTION_RULES.sensitiveKeys).toContain("access_token")
  })

  test("includes common auth-token key variants", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("token")
    expect(keys).toContain("bearer")
    expect(keys).toContain("jwt")
    expect(keys).toContain("id_token")
    expect(keys).toContain("idtoken")
  })

  test("includes session and CSRF key variants", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("session")
    expect(keys).toContain("sessionid")
    expect(keys).toContain("csrf")
    expect(keys).toContain("xsrf")
  })

  test("includes password aliases", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("passwd")
    expect(keys).toContain("pwd")
  })

  test("includes OAuth client_secret variants", () => {
    const keys = DEFAULT_REDACTION_RULES.sensitiveKeys ?? []
    expect(keys).toContain("client_secret")
    expect(keys).toContain("clientsecret")
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

  test("value patterns match Anthropic API keys", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }
    // Built at runtime so GitHub secret scanning doesn't flag the test file.
    const fakeKey = ["sk", "ant"].join("-") + "-" + "x".repeat(32)
    expect(redact(fakeKey, rules)).toBe(REDACTED)
  })

  test("value patterns match AWS access key IDs", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }
    const fakeKey = "AKI" + "A" + "X".repeat(16)
    expect(redact(fakeKey, rules)).toBe(REDACTED)
  })

  test("value patterns match Google API keys", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }
    // Google API keys are 39 chars: prefix + 35 more.
    const fakeKey = "AIz" + "a" + "X".repeat(35)
    expect(redact(fakeKey, rules)).toBe(REDACTED)
  })

  test("value patterns match Stripe keys", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }
    const body = "X".repeat(28)
    expect(redact(["sk", "live", body].join("_"), rules)).toBe(REDACTED)
    expect(redact(["pk", "test", body].join("_"), rules)).toBe(REDACTED)
    expect(redact(["rk", "live", body].join("_"), rules)).toBe(REDACTED)
  })

  test("value patterns match PEM private key blocks", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }
    const pem = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
    const result = redact(pem, rules)
    expect(result).toBe(REDACTED)

    const openssh = "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjE=\n-----END OPENSSH PRIVATE KEY-----"
    expect(redact(openssh, rules)).toBe(REDACTED)

    const generic = "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----"
    expect(redact(generic, rules)).toBe(REDACTED)
  })

  test("GitHub PAT pattern covers all prefix variants", () => {
    const rules: McpRedactionRules = { valuePatterns: DEFAULT_REDACTION_RULES.valuePatterns }
    // Built at runtime so GitHub secret scanning doesn't flag the test file.
    const body = "X".repeat(36)
    for (const prefix of ["ghp", "ghs", "gho", "ghu", "ghr"]) {
      expect(redact(`${prefix}_${body}`, rules)).toBe(REDACTED)
    }
  })
})

describe("form-urlencoded body redaction", () => {
  test("redacts sensitive values in form-encoded body strings", () => {
    const rules: McpRedactionRules = {
      sensitiveKeys: ["password", "token"],
      valuePatterns: [],
    }
    const body = "username=alice&password=s3cret&token=abc123&remember=1"
    const result = redact(body, rules)
    expect(result).toBe(`username=alice&password=${REDACTED}&token=${REDACTED}&remember=1`)
  })

  test("redacts form-encoded inside a request.data string", () => {
    const rules: McpRedactionRules = {
      sensitiveKeys: ["password"],
      valuePatterns: [],
    }
    const data = {
      request: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: "user=alice&password=hunter2",
      },
    }
    const result = redact(data, rules) as any
    expect(result.request.data).toBe(`user=alice&password=${REDACTED}`)
  })

  test("does not false-positive on casual strings with '=' ", () => {
    const rules: McpRedactionRules = {
      sensitiveKeys: ["password"],
      valuePatterns: [],
    }
    // Must NOT be treated as form-encoded — it's just prose with an equals sign.
    const data = { note: "The setting x=5 was applied, and the count is 3" }
    const result = redact(data, rules) as any
    expect(result.note).toBe("The setting x=5 was applied, and the count is 3")
  })

  test("does not alter form-encoded strings when no sensitive key matches", () => {
    const rules: McpRedactionRules = {
      sensitiveKeys: ["password"],
      valuePatterns: [],
    }
    const body = "page=1&limit=10&sort=desc"
    expect(redact(body, rules)).toBe(body)
  })

  test("URL with query params still uses URL path, not form-encoded path", () => {
    // Regression guard: a string containing '?' should go through the URL branch,
    // not the form-encoded branch.
    const rules: McpRedactionRules = {
      sensitiveKeys: ["token"],
      valuePatterns: [],
    }
    const url = "https://api.example.com/x?token=abc&page=1"
    expect(redact(url, rules)).toBe(`https://api.example.com/x?token=${REDACTED}&page=1`)
  })

  test("handles bracketed and percent-encoded keys", () => {
    const rules: McpRedactionRules = {
      sensitiveKeys: ["password"],
      valuePatterns: [],
    }
    const body = "user[name]=alice&password=hunter2"
    const result = redact(body, rules)
    expect(result).toBe(`user[name]=alice&password=${REDACTED}`)
  })

  test("handles plus-encoded values (form spaces)", () => {
    // Form bodies frequently use + for spaces in values, e.g. "name=Alice+Smith".
    // Pre-fix the key char class excluded +, so a key like "x+1" would skip the
    // form-encoded path entirely. Values with + always worked because [^&]* was permissive.
    const rules: McpRedactionRules = {
      sensitiveKeys: ["password"],
      valuePatterns: [],
    }
    expect(redact("name=Alice+Smith&password=hunter2", rules))
      .toBe(`name=Alice+Smith&password=${REDACTED}`)
    // Key with +
    expect(redact("a+b=1&password=hunter2", rules))
      .toBe(`a+b=1&password=${REDACTED}`)
  })
})

describe("JSON string body redaction", () => {
  const rules: McpRedactionRules = {
    sensitiveKeys: ["password", "api_key", "accessToken"],
    valuePatterns: ["sk-[a-zA-Z0-9_-]{20,}"],
  }

  test("redacts sensitive keys inside JSON-stringified request body", () => {
    const body = JSON.stringify({ password: "hunter2", api_key: "x", username: "alice" })
    const result = redact(body, rules) as string
    const parsed = JSON.parse(result)
    expect(parsed.password).toBe(REDACTED)
    expect(parsed.api_key).toBe(REDACTED)
    expect(parsed.username).toBe("alice")
  })

  test("redacts sensitive keys in nested JSON string body", () => {
    const data = {
      request: {
        data: JSON.stringify({ password: "hunter2", accessToken: "y", note: "hello" }),
      },
    }
    const result = redact(data, rules) as any
    const parsed = JSON.parse(result.request.data)
    expect(parsed.password).toBe(REDACTED)
    expect(parsed.accessToken).toBe(REDACTED)
    expect(parsed.note).toBe("hello")
  })

  test("applies value patterns inside JSON string bodies", () => {
    const body = JSON.stringify({ note: "embedded sk-ABCDEFGHIJKLMNOPQRSTUVWX" })
    const result = redact(body, rules) as string
    const parsed = JSON.parse(result)
    expect(parsed.note).toContain(REDACTED)
    expect(parsed.note).not.toContain("sk-ABCDE")
  })

  test("falls through to value patterns when string is not valid JSON", () => {
    const value = "{not valid json sk-ABCDEFGHIJKLMNOPQRSTUVWX"
    const result = redact(value, rules) as string
    expect(result).toContain(REDACTED)
    expect(result).not.toContain("sk-ABCDE")
  })

  test("handles JSON array strings", () => {
    const body = JSON.stringify([{ password: "s1" }, { api_key: "s2" }])
    const result = redact(body, rules) as string
    const parsed = JSON.parse(result)
    expect(parsed[0].password).toBe(REDACTED)
    expect(parsed[1].api_key).toBe(REDACTED)
  })

  test("does not alter non-JSON strings that happen to start with {", () => {
    // Not valid JSON — should fall through
    const value = "{this is not json}"
    const result = redact(value, rules)
    expect(result).toBe("{this is not json}")
  })
})

describe("redact() with basePath for subtree requests", () => {
  const rules: McpRedactionRules = {
    sensitiveKeys: [],
    statePathPatterns: ["redactionTest.auth.tokens.*"],
    valuePatterns: [],
  }

  test("absolute state path patterns match when basePath is provided", () => {
    // Simulates request_state({ path: "redactionTest.auth" }) returning a subtree
    const subtree = {
      username: "alice",
      tokens: { access: "raw-access", refresh: "raw-refresh" },
    }
    const result = redact(subtree, rules, "redactionTest.auth") as any
    expect(result.username).toBe("alice")
    expect(result.tokens.access).toBe(REDACTED)
    expect(result.tokens.refresh).toBe(REDACTED)
  })

  test("patterns still work without basePath (full tree)", () => {
    const fullTree = {
      redactionTest: {
        auth: {
          username: "alice",
          tokens: { access: "raw-access", refresh: "raw-refresh" },
        },
      },
    }
    const result = redact(fullTree, rules) as any
    expect(result.redactionTest.auth.username).toBe("alice")
    expect(result.redactionTest.auth.tokens.access).toBe(REDACTED)
    expect(result.redactionTest.auth.tokens.refresh).toBe(REDACTED)
  })

  test("basePath does not cause false positives", () => {
    const subtree = { name: "alice", email: "alice@example.com" }
    const result = redact(subtree, rules, "redactionTest.auth") as any
    expect(result.name).toBe("alice")
    expect(result.email).toBe("alice@example.com")
  })
})

describe("redactAsyncStorageData()", () => {
  const rules: McpRedactionRules = {
    sensitiveKeys: ["password", "api_key", "accessToken"],
    valuePatterns: ["Bearer\\s+[A-Za-z0-9\\-._~+/]+=*"],
  }

  describe("setItem / mergeItem", () => {
    test("redacts value when storage key carries a sensitive segment", () => {
      const data = { key: "auth:password", value: "hunter2" }
      const result = redactAsyncStorageData(data, rules) as any
      expect(result.value).toBe(REDACTED)
    })

    test("redacts JSON string values when storage key is not sensitive", () => {
      const jsonValue = JSON.stringify({ password: "hunter2", name: "alice" })
      const data = { key: "cached:data", value: jsonValue }
      const result = redactAsyncStorageData(data, rules) as any
      const parsed = JSON.parse(result.value)
      expect(parsed.password).toBe(REDACTED)
      expect(parsed.name).toBe("alice")
    })
  })

  describe("multiSet / multiMerge", () => {
    test("redacts values when storage key carries a sensitive segment (colon)", () => {
      const data = {
        pairs: [
          ["auth:password", "hunter2"],
          ["auth:api_key", "leaked-api-key"],
          ["settings:theme", "dark"],
        ],
      }
      const result = redactAsyncStorageData(data, rules) as any
      expect(result.pairs[0]).toEqual(["auth:password", REDACTED])
      expect(result.pairs[1]).toEqual(["auth:api_key", REDACTED])
      expect(result.pairs[2]).toEqual(["settings:theme", "dark"])
    })

    test("redacts when storage key uses dot separator", () => {
      const data = { pairs: [["user.accessToken", "secret-token"]] }
      const result = redactAsyncStorageData(data, rules) as any
      expect(result.pairs[0][1]).toBe(REDACTED)
    })

    test("redacts when storage key uses slash separator", () => {
      const data = { pairs: [["auth/password", "hunter2"]] }
      const result = redactAsyncStorageData(data, rules) as any
      expect(result.pairs[0][1]).toBe(REDACTED)
    })

    test("redacts when storage key contains sensitive key as substring", () => {
      const data = {
        pairs: [
          ["auth_password", "hunter2"],
          ["persist:api_key", "leaked"],
          ["myAccessToken", "secret"],
        ],
      }
      const result = redactAsyncStorageData(data, rules) as any
      expect(result.pairs[0][1]).toBe(REDACTED)
      expect(result.pairs[1][1]).toBe(REDACTED)
      expect(result.pairs[2][1]).toBe(REDACTED)
    })

    test("applies JSON-string redaction to non-sensitive pair values", () => {
      const jsonValue = JSON.stringify({ password: "hunter2", api_key: "leaked", note: "Bearer abcdef1234567890ABCDEFGH" })
      const data = { pairs: [["auth:session_data", jsonValue]] }
      const result = redactAsyncStorageData(data, rules) as any
      const parsed = JSON.parse(result.pairs[0][1])
      expect(parsed.password).toBe(REDACTED)
      expect(parsed.api_key).toBe(REDACTED)
      expect(parsed.note).toBe(REDACTED) // Bearer pattern match
    })

    test("preserves non-pair fields on the wrapper", () => {
      const data = { pairs: [["auth:password", "hunter2"]], extra: "preserved" }
      const result = redactAsyncStorageData(data, rules) as any
      expect(result.extra).toBe("preserved")
      expect(result.pairs[0][1]).toBe(REDACTED)
    })
  })

  test("handles null and undefined", () => {
    expect(redactAsyncStorageData(null, rules)).toBeNull()
    expect(redactAsyncStorageData(undefined, rules)).toBeUndefined()
  })

  test("returns data unchanged when no sensitiveKeys configured", () => {
    const emptyRules: McpRedactionRules = { sensitiveKeys: [], valuePatterns: [] }
    const data = { pairs: [["auth:password", "hunter2"]] }
    const result = redactAsyncStorageData(data, emptyRules) as any
    expect(result.pairs[0][1]).toBe("hunter2")
  })
})

describe("createRedactor()", () => {
  // Minimal mock: connections is the only field createRedactor reaches into.
  function mockServer(connections: Array<{ clientId: string; mcpRedaction?: McpRedactionConfig }>) {
    return { connections } as any
  }

  test("memoizes rule resolution per clientId", () => {
    // Spy on resolveEffectiveRules by counting how many times the underlying
    // server.connections lookup runs. Since we can't spy on the internal helper
    // directly, drive a connections array whose `.find` we instrument.
    const conn = { clientId: "app-A", mcpRedaction: { additionalRules: { sensitiveKeys: ["foo"] } } }
    let findCalls = 0
    const connections: any = [conn]
    const origFind = connections.find.bind(connections)
    connections.find = (predicate: any) => { findCalls++; return origFind(predicate) }

    const redactor = createRedactor({ connections } as any, DEFAULT_SERVER_CONFIG)
    redactor.redact({ foo: "x", password: "y" }, "app-A")
    redactor.redact({ foo: "x", password: "y" }, "app-A")
    redactor.redact({ foo: "x", password: "y" }, "app-A")

    // Only one connection lookup despite three redact calls.
    expect(findCalls).toBe(1)
  })

  test("separate cache entries per clientId", () => {
    const connections = [
      { clientId: "app-A", mcpRedaction: { additionalRules: { sensitiveKeys: ["fooA"] } } },
      { clientId: "app-B", mcpRedaction: { additionalRules: { sensitiveKeys: ["fooB"] } } },
    ]
    const redactor = createRedactor({ connections } as any, DEFAULT_SERVER_CONFIG)

    const dataA = redactor.redact({ fooA: "leak", fooB: "ok" }, "app-A") as any
    const dataB = redactor.redact({ fooA: "ok", fooB: "leak" }, "app-B") as any

    expect(dataA.fooA).toBe(REDACTED)
    expect(dataA.fooB).toBe("ok")
    expect(dataB.fooA).toBe("ok")
    expect(dataB.fooB).toBe(REDACTED)
  })

  test("redactState anchors path patterns at statePath", () => {
    const config: McpRedactionServerConfig = {
      ...DEFAULT_SERVER_CONFIG,
      defaults: { ...DEFAULT_SERVER_CONFIG.defaults, statePathPatterns: ["auth.tokens.*"] },
    }
    const redactor = createRedactor(mockServer([]), config)

    const subtree = { tokens: { access: "raw" } }
    const result = redactor.redactState(subtree, undefined, "auth") as any
    expect(result.tokens.access).toBe(REDACTED)
  })

  test("redactAsyncStorage applies storage-key heuristic", () => {
    const redactor = createRedactor(mockServer([]), DEFAULT_SERVER_CONFIG)
    const data = { pairs: [["auth:password", "hunter2"]] }
    const result = redactor.redactAsyncStorage(data) as any
    expect(result.pairs[0][1]).toBe(REDACTED)
  })

  test("returns data unchanged when client has fully disabled redaction", () => {
    const config: McpRedactionServerConfig = { ...DEFAULT_SERVER_CONFIG, allowClientDisable: true }
    const redactor = createRedactor(
      mockServer([{ clientId: "app-A", mcpRedaction: { disableRedaction: true } }]),
      config
    )
    const data = { password: "hunter2" }
    expect(redactor.redact(data, "app-A")).toBe(data)
  })
})
