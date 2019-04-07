import Store from "electron-store"

const schema = {
  server: {
    port: {
      type: "number",
      default: 9090,
    },
  },
}

const configStore = new Store({ schema })

// Setup defaults
if (!configStore.has("server.port")) {
  configStore.set("server.port", 9090)
}

export default configStore
