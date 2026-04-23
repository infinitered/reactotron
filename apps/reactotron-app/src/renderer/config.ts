import Store from "electron-store"

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
      default: [
        "authorization", "cookie", "set-cookie",
        "x-api-key", "x-auth-token", "proxy-authorization",
      ],
    },
    mcpRedactionSensitiveKeys: {
      type: "array",
      items: { type: "string" },
      default: [
        "password", "secret", "apikey", "api_key", "accesstoken",
        "access_token", "refreshtoken", "refresh_token", "privatekey",
        "private_key", "credentials", "ssn", "creditcard",
      ],
    },
    mcpRedactionStatePathPatterns: {
      type: "array",
      items: { type: "string" },
      default: [],
    },
    mcpRedactionValuePatterns: {
      type: "array",
      items: { type: "string" },
      default: [
        "Bearer\\s+[A-Za-z0-9\\-._~+/]+=*",
        "eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}",
        "sk-[a-zA-Z0-9]{20,}",
        "ghp_[a-zA-Z0-9]{30,}",
        "xox[bpoas]-[a-zA-Z0-9\\-]{10,}",
      ],
    },
    mcpAllowClientDisable: {
      type: "boolean",
      default: false,
    },
    mcpAllowClientRemoveRules: {
      type: "boolean",
      default: false,
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
