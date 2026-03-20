import Store from "electron-store"

type StoreType = {
  serverPort: number
  commandHistory: number
  mcpPort: number
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
