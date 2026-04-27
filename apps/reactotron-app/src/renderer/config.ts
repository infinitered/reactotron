import Store from "electron-store"
import { DEFAULT_REDACTION_RULES, DEFAULT_SERVER_CONFIG } from "reactotron-mcp"

type StoreType = {
  serverPort: number
  commandHistory: number
  mcpPort: number
  mcpRedactionHeaderNames: string[]
  mcpRedactionSensitiveKeys: string[]
  mcpRedactionStatePathPatterns: string[]
  mcpRedactionValuePatterns: string[]
  mcpAllowClientDisable: boolean
  mcpAllowClientRemoveRules: boolean
}

const config = new Store<StoreType>({
  schema: {
    serverPort: {
      type: "number",
      default: 9090,
    },
    commandHistory: {
      type: "number",
      default: 500,
    },
    mcpPort: {
      type: "number",
      default: 4567,
    },
    mcpRedactionHeaderNames: {
      type: "array",
      items: { type: "string" },
      default: DEFAULT_REDACTION_RULES.headerNames,
    },
    mcpRedactionSensitiveKeys: {
      type: "array",
      items: { type: "string" },
      default: DEFAULT_REDACTION_RULES.sensitiveKeys,
    },
    mcpRedactionStatePathPatterns: {
      type: "array",
      items: { type: "string" },
      default: DEFAULT_REDACTION_RULES.statePathPatterns,
    },
    mcpRedactionValuePatterns: {
      type: "array",
      items: { type: "string" },
      default: DEFAULT_REDACTION_RULES.valuePatterns,
    },
    mcpAllowClientDisable: {
      type: "boolean",
      default: DEFAULT_SERVER_CONFIG.allowClientDisable,
    },
    mcpAllowClientRemoveRules: {
      type: "boolean",
      default: DEFAULT_SERVER_CONFIG.allowClientRemoveRules,
    },
  },
})

// Setup defaults
if (!config.has("serverPort")) {
  config.set("serverPort", 9090)
}
if (!config.has("commandHistory")) {
  config.set("commandHistory", 500)
}
if (!config.has("mcpPort")) {
  config.set("mcpPort", 4567)
}

export default config
