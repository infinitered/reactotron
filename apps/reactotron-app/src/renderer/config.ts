import Store from "electron-store"

export const schema = {
  serverPort: {
    type: "number",
    default: 9090,
  },
  commandHistory: {
    type: "number",
    default: 500,
  },
} as const

const configStore = new Store({ schema })

// Setup defaults
if (!configStore.has("serverPort")) {
  configStore.set("serverPort", 9090)
}
if (!configStore.has("commandHistory")) {
  configStore.set("commandHistory", 500)
}

export default configStore
