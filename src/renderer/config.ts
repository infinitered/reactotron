import Store from "electron-store"

const schema = {
  server: {
    port: {
      type: "number",
      default: 9090,
    },
  },
  commandHistory: {
    type: "number",
    default: 500,
  },
}

const configStore = new Store({ schema } as any)

// Setup defaults
if (!configStore.has("server.port")) {
  configStore.set("server.port", 9090)
}
if (!configStore.has("commandHistory")) {
  configStore.set("commandHistory", 500)
}

export default configStore
