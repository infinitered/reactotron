export interface McpRedactionRules {
  /** Object key names to redact wherever found (case-insensitive match) */
  sensitiveKeys?: string[]
  /** State paths to redact (dot-separated, supports trailing wildcard "auth.tokens.*") */
  statePathPatterns?: string[]
  /** Regex patterns matched against string values */
  valuePatterns?: string[]
}

export interface McpRedactionConfig {
  /** If true, client requests opting out of redaction (requires server approval) */
  disableRedaction?: boolean
  /** Additional rules to merge on top of server defaults */
  additionalRules?: McpRedactionRules
  /** Specific default rules to remove (requires server approval) */
  removeRules?: McpRedactionRules
}
