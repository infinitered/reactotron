import type { McpRedactionRules, McpRedactionConfig } from "reactotron-core-contract"

export const REDACTED = "[REDACTED]"

export const DEFAULT_REDACTION_RULES: McpRedactionRules = {
  headerNames: [
    "authorization", "cookie", "set-cookie",
    "x-api-key", "x-auth-token", "proxy-authorization",
    "x-csrf-token", "x-xsrf-token", "csrf-token",
    "x-forwarded-for", "x-real-ip",
  ],
  sensitiveKeys: [
    "password", "passwd", "pwd",
    "secret", "client_secret", "clientsecret",
    "apikey", "api_key", "x-api-key",
    "accesstoken", "access_token",
    "refreshtoken", "refresh_token",
    "idtoken", "id_token",
    "token", "bearer", "jwt",
    "session", "sessionid", "session_id",
    "csrf", "xsrf", "csrf_token", "xsrf_token",
    "privatekey", "private_key",
    "credentials", "ssn", "creditcard",
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
 * Compute the effective redaction rules by merging server defaults with client config,
 * respecting server permissions.
 */
export function resolveEffectiveRules(
  serverConfig: McpRedactionServerConfig,
  clientConfig?: McpRedactionConfig
): McpRedactionRules | null {
  if (!clientConfig) return serverConfig.defaults

  // Client wants to disable redaction entirely
  if (clientConfig.disableRedaction && serverConfig.allowClientDisable) {
    return null
  }

  let rules = deepCopyRules(serverConfig.defaults)

  // Remove rules only if server allows
  if (clientConfig.removeRules && serverConfig.allowClientRemoveRules) {
    rules = subtractRules(rules, clientConfig.removeRules)
  }

  // Additional rules are always allowed
  if (clientConfig.additionalRules) {
    rules = mergeRules(rules, clientConfig.additionalRules)
  }

  return rules
}

function deepCopyRules(rules: McpRedactionRules): McpRedactionRules {
  return {
    headerNames: rules.headerNames ? [...rules.headerNames] : [],
    sensitiveKeys: rules.sensitiveKeys ? [...rules.sensitiveKeys] : [],
    statePathPatterns: rules.statePathPatterns ? [...rules.statePathPatterns] : [],
    valuePatterns: rules.valuePatterns ? [...rules.valuePatterns] : [],
  }
}

function mergeRules(base: McpRedactionRules, additional: McpRedactionRules): McpRedactionRules {
  return {
    headerNames: dedupe([...(base.headerNames ?? []), ...(additional.headerNames ?? [])]),
    sensitiveKeys: dedupe([...(base.sensitiveKeys ?? []), ...(additional.sensitiveKeys ?? [])]),
    statePathPatterns: dedupe([...(base.statePathPatterns ?? []), ...(additional.statePathPatterns ?? [])]),
    valuePatterns: dedupe([...(base.valuePatterns ?? []), ...(additional.valuePatterns ?? [])]),
  }
}

function subtractRules(base: McpRedactionRules, remove: McpRedactionRules): McpRedactionRules {
  const removeLower = (arr: string[]) => new Set(arr.map((s) => s.toLowerCase()))

  const removeHeaders = removeLower(remove.headerNames ?? [])
  const removeKeys = removeLower(remove.sensitiveKeys ?? [])
  const removePaths = new Set(remove.statePathPatterns ?? [])
  const removePatterns = new Set(remove.valuePatterns ?? [])

  return {
    headerNames: (base.headerNames ?? []).filter((h) => !removeHeaders.has(h.toLowerCase())),
    sensitiveKeys: (base.sensitiveKeys ?? []).filter((k) => !removeKeys.has(k.toLowerCase())),
    statePathPatterns: (base.statePathPatterns ?? []).filter((p) => !removePaths.has(p)),
    valuePatterns: (base.valuePatterns ?? []).filter((p) => !removePatterns.has(p)),
  }
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)]
}

/**
 * Deep-walk an object and redact sensitive values in place (returns a new object).
 * Handles circular references by tracking seen objects.
 */
export function redact(data: unknown, rules: McpRedactionRules, currentPath = ""): unknown {
  if (data === null || data === undefined) return data

  if (typeof data === "string") {
    return redactStringValue(data, rules)
  }

  if (typeof data !== "object") return data

  if (Array.isArray(data)) {
    return data.map((item, i) => redact(item, rules, currentPath ? `${currentPath}.${i}` : String(i)))
  }

  // Object — deep walk with circular reference protection
  const seen = new Set<unknown>()
  return redactObject(data as Record<string, unknown>, rules, currentPath, seen)
}

function redactObject(
  obj: Record<string, unknown>,
  rules: McpRedactionRules,
  currentPath: string,
  seen: Set<unknown>
): Record<string, unknown> {
  if (seen.has(obj)) return { _circular: REDACTED }
  seen.add(obj)

  const result: Record<string, unknown> = {}
  const sensitiveKeysLower = new Set((rules.sensitiveKeys ?? []).map((k) => k.toLowerCase()))
  const headerNamesLower = new Set((rules.headerNames ?? []).map((h) => h.toLowerCase()))

  for (const [key, value] of Object.entries(obj)) {
    const childPath = currentPath ? `${currentPath}.${key}` : key

    // Check state path patterns
    if (matchesStatePath(childPath, rules.statePathPatterns ?? [])) {
      result[key] = REDACTED
      continue
    }

    // Check sensitive key names (case-insensitive)
    if (sensitiveKeysLower.has(key.toLowerCase())) {
      result[key] = REDACTED
      continue
    }

    // Header-specific redaction: if the key is "headers", redact matching header names inside
    if (key.toLowerCase() === "headers" && value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = redactHeaders(value as Record<string, unknown>, headerNamesLower, rules, childPath, seen)
      continue
    }

    // Recurse
    if (value === null || value === undefined) {
      result[key] = value
    } else if (typeof value === "string") {
      result[key] = redactStringValue(value, rules)
    } else if (Array.isArray(value)) {
      result[key] = value.map((item, i) => {
        if (item && typeof item === "object") {
          return redactObject(item as Record<string, unknown>, rules, `${childPath}.${i}`, seen)
        }
        if (typeof item === "string") return redactStringValue(item, rules)
        return item
      })
    } else if (typeof value === "object") {
      result[key] = redactObject(value as Record<string, unknown>, rules, childPath, seen)
    } else {
      result[key] = value
    }
  }

  return result
}

function redactHeaders(
  headers: Record<string, unknown>,
  headerNamesLower: Set<string>,
  rules: McpRedactionRules,
  currentPath: string,
  seen: Set<unknown>
): Record<string, unknown> {
  if (seen.has(headers)) return { _circular: REDACTED }
  seen.add(headers)

  const result: Record<string, unknown> = {}
  const sensitiveKeysLower = new Set((rules.sensitiveKeys ?? []).map((k) => k.toLowerCase()))

  for (const [key, value] of Object.entries(headers)) {
    // Redact header names from the headerNames list
    if (headerNamesLower.has(key.toLowerCase())) {
      result[key] = REDACTED
      continue
    }
    // Also check sensitiveKeys for headers
    if (sensitiveKeysLower.has(key.toLowerCase())) {
      result[key] = REDACTED
      continue
    }
    // Apply value pattern matching to header values
    if (typeof value === "string") {
      result[key] = redactStringValue(value, rules)
    } else {
      result[key] = value
    }
  }

  return result
}

function redactStringValue(value: string, rules: McpRedactionRules): string {
  let result = value

  // Redact URL query parameters whose names match sensitiveKeys
  const sensitiveKeys = rules.sensitiveKeys ?? []
  if (sensitiveKeys.length > 0) {
    if (result.includes("?")) {
      result = redactUrlQueryParams(result, sensitiveKeys)
    } else if (looksLikeFormEncoded(result)) {
      result = redactFormEncodedParams(result, sensitiveKeys)
    }
  }

  // Redact value patterns
  const patterns = rules.valuePatterns ?? []
  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, "g")
      result = result.replace(regex, REDACTED)
    } catch {
      // Invalid regex — skip
    }
  }
  return result
}

/**
 * Detect a form-urlencoded body string (e.g. "user=alice&password=x"). Must be the whole
 * string — `foo=bar` mid-sentence won't match. We require at least one "=" and that the
 * full string is `k=v(&k=v)*` shape to avoid false positives on casual strings.
 */
function looksLikeFormEncoded(value: string): boolean {
  if (!value || value.length > 8192) return false
  return /^[\w.\-[\]%]+=[^&]*(?:&[\w.\-[\]%]+=[^&]*)*$/.test(value)
}

/** Redact values in a form-urlencoded body where the param name matches sensitiveKeys. */
function redactFormEncodedParams(value: string, sensitiveKeys: string[]): string {
  const sensitiveSet = new Set(sensitiveKeys.map((k) => k.toLowerCase()))
  return value.split("&").map((param) => {
    const eqIndex = param.indexOf("=")
    if (eqIndex === -1) return param
    const name = param.slice(0, eqIndex)
    if (sensitiveSet.has(name.toLowerCase())) {
      return `${name}=${REDACTED}`
    }
    return param
  }).join("&")
}

/** Redact query parameter values in URLs where the param name matches sensitiveKeys. */
function redactUrlQueryParams(value: string, sensitiveKeys: string[]): string {
  const qIndex = value.indexOf("?")
  if (qIndex === -1) return value

  const sensitiveSet = new Set(sensitiveKeys.map((k) => k.toLowerCase()))
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
    if (sensitiveSet.has(name.toLowerCase())) {
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
