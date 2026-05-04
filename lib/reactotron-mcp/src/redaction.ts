import type { McpRedactionRules, McpRedactionConfig } from "reactotron-core-contract"
import type ReactotronServer from "reactotron-core-server"

export const REDACTED = "[REDACTED]"

export const DEFAULT_REDACTION_RULES: McpRedactionRules = {
  sensitiveKeys: [
    // Credentials
    "password", "passwd", "pwd",
    "secret", "client_secret", "clientsecret",
    "credentials", "ssn", "creditcard",
    "privatekey", "private_key",
    // API keys
    "apikey", "api_key", "x-api-key",
    // Auth tokens
    "accesstoken", "access_token",
    "refreshtoken", "refresh_token",
    "idtoken", "id_token",
    "token", "bearer", "jwt",
    // Session / CSRF
    "session", "sessionid", "session_id",
    "csrf", "xsrf", "csrf_token", "xsrf_token",
    // HTTP headers
    "authorization", "cookie", "set-cookie", "proxy-authorization",
    "x-auth-token", "x-csrf-token", "x-xsrf-token", "csrf-token",
    "x-forwarded-for", "x-real-ip",
  ],
  statePathPatterns: [],
  valuePatterns: [
    // Bearer tokens
    "Bearer\\s+[A-Za-z0-9\\-._~+/]+=*",
    // JWTs (header.payload[.signature])
    "eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}",
    // OpenAI-style keys (also matches our legacy "sk-..." pattern)
    "sk-[a-zA-Z0-9_-]{20,}",
    // Anthropic API keys
    "sk-ant-[a-zA-Z0-9_-]{20,}",
    // GitHub PATs / fine-grained tokens
    "gh[pousr]_[A-Za-z0-9]{30,}",
    // Slack tokens
    "xox[bpoas]-[a-zA-Z0-9\\-]{10,}",
    // AWS access key IDs
    "AKIA[0-9A-Z]{16}",
    // Google API keys
    "AIza[0-9A-Za-z\\-_]{35}",
    // Stripe keys (live/test, secret/publishable/restricted)
    "(?:sk|pk|rk)_(?:test|live)_[A-Za-z0-9]{24,}",
    // PEM-encoded private key blocks (RSA, EC, DSA, OPENSSH, or generic)
    "-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----[\\s\\S]+?-----END (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----",
  ],
}

export interface McpRedactionServerConfig {
  defaults: McpRedactionRules
  allowClientDisable: boolean
  allowClientRemoveRules: boolean
}

export const DEFAULT_SERVER_CONFIG: McpRedactionServerConfig = {
  defaults: DEFAULT_REDACTION_RULES,
  allowClientDisable: false,
  allowClientRemoveRules: false,
}

/**
 * Resolve effective rules by merging server defaults with client config.
 * `additionalRules` apply unconditionally; `disableRedaction` and `removeRules`
 * require the matching server-side permission.
 */
export function resolveEffectiveRules(
  serverConfig: McpRedactionServerConfig,
  clientConfig?: McpRedactionConfig
): McpRedactionRules | null {
  if (!clientConfig) return serverConfig.defaults

  if (clientConfig.disableRedaction && serverConfig.allowClientDisable) {
    return null
  }

  let rules = deepCopyRules(serverConfig.defaults)

  if (clientConfig.removeRules && serverConfig.allowClientRemoveRules) {
    rules = subtractRules(rules, clientConfig.removeRules)
  }

  if (clientConfig.additionalRules) {
    rules = mergeRules(rules, clientConfig.additionalRules)
  }

  return rules
}

/**
 * Get a client's McpRedactionConfig. With no clientId, returns the lone
 * client's config when exactly one is connected, otherwise undefined —
 * resource reads that aggregate across apps must pass clientId per event.
 */
export function getClientRedactionConfig(server: ReactotronServer, clientId?: string): McpRedactionConfig | undefined {
  const connections = server.connections as any[]
  if (clientId) {
    const conn = connections.find((c) => c.clientId === clientId)
    return conn?.mcpRedaction
  }
  if (connections.length === 1) {
    return connections[0]?.mcpRedaction
  }
  return undefined
}

/**
 * Scoped redactor that caches resolved rules per clientId. Create one per
 * MCP request so a multi-event read does one resolve per distinct app.
 */
export interface Redactor {
  /** Redact a generic payload (network entry, log event, action, etc.). */
  redact(data: unknown, clientId?: string): unknown
  /** Redact a state payload anchored at `statePath` (pass "" for full tree). */
  redactState(data: unknown, clientId: string | undefined, statePath: string): unknown
  /** Redact an AsyncStorage mutation payload (storage-key heuristic + deep walk). */
  redactAsyncStorage(data: unknown, clientId?: string): unknown
}

const NO_CLIENT = "\0__no_client__"

export function createRedactor(
  server: ReactotronServer,
  serverRedactionConfig: McpRedactionServerConfig,
): Redactor {
  const cache = new Map<string, ParsedRules | null>()

  function parsedFor(clientId?: string): ParsedRules | null {
    const key = clientId ?? NO_CLIENT
    if (cache.has(key)) return cache.get(key)!
    const clientConfig = getClientRedactionConfig(server, clientId)
    const rules = resolveEffectiveRules(serverRedactionConfig, clientConfig)
    const parsed = rules ? parseRules(rules) : null
    cache.set(key, parsed)
    return parsed
  }

  return {
    redact(data, clientId) {
      const parsed = parsedFor(clientId)
      return parsed ? redactWithParsed(data, parsed) : data
    },
    redactState(data, clientId, statePath) {
      const parsed = parsedFor(clientId)
      return parsed ? redactWithParsed(data, parsed, statePath) : data
    },
    redactAsyncStorage(data, clientId) {
      const parsed = parsedFor(clientId)
      if (!parsed) return data
      return redactWithParsed(redactAsyncStorageWithParsed(data, parsed), parsed)
    },
  }
}

function deepCopyRules(rules: McpRedactionRules): McpRedactionRules {
  return {
    sensitiveKeys: rules.sensitiveKeys ? [...rules.sensitiveKeys] : [],
    statePathPatterns: rules.statePathPatterns ? [...rules.statePathPatterns] : [],
    valuePatterns: rules.valuePatterns ? [...rules.valuePatterns] : [],
  }
}

function mergeRules(base: McpRedactionRules, additional: McpRedactionRules): McpRedactionRules {
  return {
    sensitiveKeys: dedupe([...(base.sensitiveKeys ?? []), ...(additional.sensitiveKeys ?? [])]),
    statePathPatterns: dedupe([...(base.statePathPatterns ?? []), ...(additional.statePathPatterns ?? [])]),
    valuePatterns: dedupe([...(base.valuePatterns ?? []), ...(additional.valuePatterns ?? [])]),
  }
}

function subtractRules(base: McpRedactionRules, remove: McpRedactionRules): McpRedactionRules {
  const removeLower = (arr: string[]) => new Set(arr.map((s) => s.toLowerCase()))

  const removeKeys = removeLower(remove.sensitiveKeys ?? [])
  const removePaths = new Set(remove.statePathPatterns ?? [])
  const removePatterns = new Set(remove.valuePatterns ?? [])

  return {
    sensitiveKeys: (base.sensitiveKeys ?? []).filter((k) => !removeKeys.has(k.toLowerCase())),
    statePathPatterns: (base.statePathPatterns ?? []).filter((p) => !removePaths.has(p)),
    valuePatterns: (base.valuePatterns ?? []).filter((p) => !removePatterns.has(p)),
  }
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)]
}

const MAX_JSON_STRING_DEPTH = 5
const MAX_JSON_PARSE_LENGTH = 1_000_000

/** Precomputed form of a rules object, reused across redact() calls. */
interface ParsedRules {
  sensitiveKeysLower: Set<string>
  /** All valuePatterns folded into a single alternation; null when no valid patterns. */
  combinedValueRegex: RegExp | null
  statePathPatterns: string[]
  /** Cached `statePathPatterns.length > 0` — gates path-string allocation. */
  trackPaths: boolean
}

/**
 * Validate each pattern individually so one bad regex doesn't kill the rest,
 * then fold the survivors into a single alternation for one-pass matching.
 */
function compileCombinedValueRegex(patterns: string[]): RegExp | null {
  const valid: string[] = []
  for (const pattern of patterns) {
    try {
      new RegExp(pattern)
      valid.push(pattern)
    } catch {
      // Invalid regex — skip
    }
  }
  if (valid.length === 0) return null
  try {
    return new RegExp(valid.map((p) => `(?:${p})`).join("|"), "g")
  } catch {
    return null
  }
}

function parseRules(rules: McpRedactionRules): ParsedRules {
  const statePathPatterns = rules.statePathPatterns ?? []
  return {
    sensitiveKeysLower: new Set((rules.sensitiveKeys ?? []).map((k) => k.toLowerCase())),
    combinedValueRegex: compileCombinedValueRegex(rules.valuePatterns ?? []),
    statePathPatterns,
    trackPaths: statePathPatterns.length > 0,
  }
}

/** Per-call state threaded through recursion. */
interface RedactionContext {
  parsed: ParsedRules
  seen: Set<unknown>
  jsonStringDepth: number
}

function makeContext(parsed: ParsedRules, jsonStringDepth = 0): RedactionContext {
  return { parsed, seen: new Set<unknown>(), jsonStringDepth }
}

/**
 * Deep-walk an object and redact sensitive values (returns a new object).
 * Handles circular references by tracking seen objects.
 */
export function redact(data: unknown, rules: McpRedactionRules, currentPath = ""): unknown {
  return redactWithParsed(data, parseRules(rules), currentPath)
}

function redactWithParsed(data: unknown, parsed: ParsedRules, currentPath = ""): unknown {
  return redactValue(data, makeContext(parsed), currentPath)
}

function redactValue(data: unknown, ctx: RedactionContext, currentPath: string): unknown {
  if (data === null || data === undefined) return data

  if (typeof data === "string") {
    return redactStringValue(data, ctx)
  }

  if (typeof data !== "object") return data

  if (Array.isArray(data)) {
    if (!ctx.parsed.trackPaths) {
      return data.map((item) => redactValue(item, ctx, ""))
    }
    return data.map((item, i) => redactValue(item, ctx, currentPath ? `${currentPath}.${i}` : String(i)))
  }

  return redactObject(data as Record<string, unknown>, ctx, currentPath)
}

function redactObject(
  obj: Record<string, unknown>,
  ctx: RedactionContext,
  currentPath: string,
): Record<string, unknown> {
  if (ctx.seen.has(obj)) return { _circular: REDACTED }
  ctx.seen.add(obj)

  const result: Record<string, unknown> = {}
  const sensitiveKeysLower = ctx.parsed.sensitiveKeysLower
  const trackPaths = ctx.parsed.trackPaths

  for (const [key, value] of Object.entries(obj)) {
    // Common case first — most keys aren't path-pattern matches.
    if (sensitiveKeysLower.has(key.toLowerCase())) {
      result[key] = REDACTED
      continue
    }

    if (trackPaths) {
      const childPath = currentPath ? `${currentPath}.${key}` : key
      if (matchesStatePath(childPath, ctx.parsed.statePathPatterns)) {
        result[key] = REDACTED
        continue
      }
      result[key] = redactValue(value, ctx, childPath)
    } else {
      result[key] = redactValue(value, ctx, "")
    }
  }

  return result
}

function redactStringValue(value: string, ctx: RedactionContext): string {
  let result = value
  const { sensitiveKeysLower, combinedValueRegex } = ctx.parsed

  // Detect JSON strings and redact their contents by parsing → redacting → re-stringifying.
  // Guarded by depth limit (nested JSON.stringify layers) and size limit (avoid parsing huge strings).
  if (ctx.jsonStringDepth < MAX_JSON_STRING_DEPTH && result.length <= MAX_JSON_PARSE_LENGTH) {
    const trimmed = result.trim()
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const parsed = JSON.parse(result)
        if (typeof parsed === "object" && parsed !== null) {
          const innerCtx = makeContext(ctx.parsed, ctx.jsonStringDepth + 1)
          return JSON.stringify(redactValue(parsed, innerCtx, ""))
        }
      } catch {
        // Not valid JSON — fall through to other redaction strategies
      }
    }
  }

  // Redact URL query parameters whose names match sensitiveKeys
  if (sensitiveKeysLower.size > 0) {
    if (result.includes("?")) {
      result = redactUrlQueryParams(result, sensitiveKeysLower)
    } else if (looksLikeFormEncoded(result)) {
      result = redactFormEncodedParams(result, sensitiveKeysLower)
    }
  }

  if (combinedValueRegex) {
    combinedValueRegex.lastIndex = 0
    result = result.replace(combinedValueRegex, REDACTED)
  }
  return result
}

/**
 * Detect a form-urlencoded body string (e.g. "user=alice&password=x"). The
 * strict `^k=v(&k=v)*$` anchor avoids false positives on prose like "x=5".
 */
const FORM_ENCODED_RE = /^[\w.\-+~*[\]%]+=[^&]*(?:&[\w.\-+~*[\]%]+=[^&]*)*$/
function looksLikeFormEncoded(value: string): boolean {
  if (!value || value.length > 8192) return false
  return FORM_ENCODED_RE.test(value)
}

/** Redact values in a form-urlencoded body where the param name matches sensitiveKeys. */
function redactFormEncodedParams(value: string, sensitiveKeysLower: Set<string>): string {
  return value.split("&").map((param) => {
    const eqIndex = param.indexOf("=")
    if (eqIndex === -1) return param
    const name = param.slice(0, eqIndex)
    if (sensitiveKeysLower.has(name.toLowerCase())) {
      return `${name}=${REDACTED}`
    }
    return param
  }).join("&")
}

/** Redact query parameter values in URLs where the param name matches sensitiveKeys. */
function redactUrlQueryParams(value: string, sensitiveKeysLower: Set<string>): string {
  const qIndex = value.indexOf("?")
  if (qIndex === -1) return value

  const base = value.slice(0, qIndex + 1)
  const queryString = value.slice(qIndex + 1)

  // Handle fragment after query string
  const hashIndex = queryString.indexOf("#")
  const qs = hashIndex === -1 ? queryString : queryString.slice(0, hashIndex)
  const fragment = hashIndex === -1 ? "" : queryString.slice(hashIndex)

  const redactedParams = qs.split("&").map((param) => {
    const eqIndex = param.indexOf("=")
    if (eqIndex === -1) return param
    const name = param.slice(0, eqIndex)
    if (sensitiveKeysLower.has(name.toLowerCase())) {
      return `${name}=${REDACTED}`
    }
    return param
  }).join("&")

  return base + redactedParams + fragment
}

function matchesStatePath(currentPath: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (pattern.endsWith(".*")) {
      const prefix = pattern.slice(0, -2)
      // "auth.tokens.*" matches "auth.tokens.access" but NOT "auth.tokens" itself
      if (currentPath.startsWith(prefix + ".") && currentPath.length > prefix.length + 1) {
        return true
      }
    } else if (currentPath === pattern) {
      return true
    }
  }
  return false
}

/**
 * Check whether a storage key (e.g. "auth:password", "auth_password", "user.api_key")
 * contains any sensitive key name as a case-insensitive substring.
 */
function storageKeyIsSensitive(storageKey: string, sensitiveKeysLower: Set<string>): boolean {
  const keyLower = storageKey.toLowerCase()
  for (const sensitive of sensitiveKeysLower) {
    if (keyLower.includes(sensitive)) return true
  }
  return false
}

/**
 * Redact AsyncStorage mutation payloads. The storage key carries the
 * sensitive name (not any payload field), so this branches by wire shape
 * (`{ key, value }`, `{ pairs: [[k, v], ...] }`) and tests the key against
 * sensitiveKeys before redacting the corresponding value.
 */
export function redactAsyncStorageData(data: unknown, rules: McpRedactionRules): unknown {
  if (data === null || data === undefined) return data
  return redactAsyncStorageWithParsed(data, parseRules(rules))
}

function redactAsyncStorageWithParsed(data: unknown, parsed: ParsedRules): unknown {
  if (parsed.sensitiveKeysLower.size === 0) return data
  return redactAsyncStorageItem(data, makeContext(parsed))
}

function redactAsyncStorageItem(data: unknown, ctx: RedactionContext): unknown {
  const sensitiveKeysLower = ctx.parsed.sensitiveKeysLower

  // [key, value] tuple from a multiSet/multiMerge `pairs` entry.
  if (Array.isArray(data) && data.length === 2 && typeof data[0] === "string") {
    const [key, value] = data as [string, unknown]
    if (storageKeyIsSensitive(key, sensitiveKeysLower)) return [key, REDACTED]
    if (typeof value === "string") return [key, redactStringValue(value, ctx)]
    return data
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>

    // multiSet / multiMerge: { pairs: [[key, value], ...] }
    if (Array.isArray(obj.pairs)) {
      return { ...obj, pairs: obj.pairs.map((p) => redactAsyncStorageItem(p, ctx)) }
    }

    // setItem / mergeItem: { key, value }
    if ("key" in obj && typeof obj.key === "string") {
      const result = { ...obj }
      if (storageKeyIsSensitive(obj.key, sensitiveKeysLower) && "value" in obj) {
        result.value = REDACTED
      } else if ("value" in obj && typeof obj.value === "string") {
        result.value = redactStringValue(obj.value as string, ctx)
      }
      return result
    }
  }

  return data
}
