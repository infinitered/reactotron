import Store from "electron-store"

const schema = {
  serverPort: {
    type: "number",
    default: 9090,
  },
  commandHistory: {
    type: "number",
    default: 500,
  },
}

const configStore = new Store({ schema } as any)

// Setup defaults
if (!configStore.has("serverPort")) {
  configStore.set("serverPort", 9090)
}
if (!configStore.has("commandHistory")) {
  configStore.set("commandHistory", 500)
}

export default configStore
