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
  analyticsOptOut: {
    type: ["string", "boolean"],
    default: "unknown",
  },
}

const configStore = new Store({
  schema,
  defaults: {
    serverPort: schema.serverPort.default,
    commandHistory: schema.commandHistory.default,
    analyticsOptOut: schema.analyticsOptOut.default,
  },
  beforeEachMigration: (_store, context) => {
    console.log(`[main-config] migrate from ${context.fromVersion} → ${context.toVersion}`)
  },
  migrations: {
    "1.0.0": (store) => {
      // Added analyticsOptOut in order to track if the user has opted out of analytics
      // and present the user with a blocking dialog box.
      // When the user makes a choice, it will be set to "true" or "false"
      store.set("analyticsOptOut", "unknown")
    },
  },
} as any)

// Setup defaults
if (!configStore.has("serverPort")) {
  configStore.set("serverPort", schema.serverPort.default)
}
if (!configStore.has("commandHistory")) {
  configStore.set("commandHistory", schema.commandHistory.default)
}
if (!configStore.has("analyticsOptOut")) {
  configStore.set("analyticsOptOut", schema.analyticsOptOut.default)
}

export default configStore
