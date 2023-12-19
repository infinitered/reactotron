import { type Instance, t, getSnapshot } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { type Connection, ConnectionModel } from "./Connection"

export const RootStoreModel = t
  .model({
    sidebar: t.enumeration(["open", "closed"] as const),
    footer: t.enumeration(["mini", "expanded"] as const),
    serverStatus: t.enumeration(["stopped", "started", "portUnavailable"] as const),
    connections: t.array(ConnectionModel),
    selectedClientId: t.maybeNull(t.string),
  })
  .volatile((store) => ({
    commandListeners: [] as ((command: any) => void)[],
  }))
  .views((store) => ({
    get sidebarOpen() {
      return store.sidebar === "open"
    },
    get footerExpanded() {
      return store.footer === "expanded"
    },
    get activeConnections() {
      return store.connections.filter((c) => c.connected)
    },
    get selectedConnection() {
      return store.connections.find((c) => c.clientId === store.selectedClientId)
    },
  }))
  .views((store) => ({
    get currentCommands() {
      return store.selectedConnection?.commands ?? []
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    toggleSidebar() {
      store.sidebar = store.sidebarOpen ? "closed" : "open"
    },
    toggleFooter() {
      store.footer = store.footer === "mini" ? "expanded" : "mini"
    },
    addConnection(payload: Connection) {
      let existingConnection: Connection = store.connections.find(
        (c) => c.clientId === payload.clientId
      )

      if (existingConnection) {
        existingConnection.setProp("connected", true)
      } else {
        existingConnection = ConnectionModel.create({
          ...payload,
          commands: [],
          connected: true,
        })

        store.connections.push(existingConnection)
      }

      // If we don't have a selected client, select this one
      const firstActiveConnection = store.activeConnections?.[0]
      store.selectedClientId ||= firstActiveConnection.clientId
    },
    removeConnection(payload: Connection) {
      const existingConnection = store.connections.find((c) => c.clientId === payload.clientId)

      if (!existingConnection) return

      existingConnection.setProp("connected", false)

      // If we're removing the currently selected client, select the first active client
      if (store.selectedClientId === payload.clientId) {
        const firstActiveConnection = store.activeConnections?.[0]

        store.selectedClientId = firstActiveConnection?.clientId ?? null
      }
    },
    commandReceived(payload: any) {
      if (!payload.clientId) {
        throw new Error("Command must have a clientId")
        // or handle orphaned commands like before?
      }

      // Notify listeners
      store.commandListeners.forEach((cl) => cl(payload))

      // Add to the proper connection
      const connection = store.connections.find((c) => c.clientId === payload.clientId)

      // If we can't find a connection, throw
      if (!connection) {
        throw new Error(`Command received for unknown connection ${payload.clientId}`)
      }

      connection.addCommand(payload)
    },
    clearCommands() {
      store.selectedConnection?.clearCommands?.()
    },
    addCommandListener(callback: (command: any) => void) {
      store.commandListeners.push(callback)
    },
    selectConnection(clientId: string) {
      store.selectedClientId = clientId
    },
  }))
  .actions((store) => ({
    logDiagnostic() {
      console.log({ RootStore: getSnapshot(store) })
    },
  }))

export type RootStore = Instance<typeof RootStoreModel>
export type ServerStatus = RootStore["serverStatus"]

// Singleton
let _rootStore = null
export function useStore(): RootStore {
  if (!_rootStore) {
    _rootStore = RootStoreModel.create({
      sidebar: "open",
      serverStatus: "stopped",
      footer: "mini",
      connections: [],
      selectedClientId: null,
    })
  }

  return _rootStore
}
