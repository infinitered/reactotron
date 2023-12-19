import { type Instance, t } from "mobx-state-tree"
// import { ConnectionModel } from "./Connection"

export const RootStoreModel = t
  .model({
    sidebar: t.enumeration(["open", "closed"]),
    // serverStatus: t.optional(t.enumeration(["started", "stopped", "unavailable"]), "stopped"),
    // connections: t.array(ConnectionModel),
    // selectedClientId: t.optional(t.string, ""),
    // orphanedCommands: t.array(t.frozen()),
    // commandListeners: t.array(t.frozen()),
  })
  .views((store) => ({
    get sidebarOpen() {
      return store.sidebar === "open"
    },
  }))
  .actions((store) => ({
    toggleSidebar() {
      store.sidebar = store.sidebarOpen ? "closed" : "open"
    },
  }))

export type RootStore = Instance<typeof RootStoreModel>

// Singleton
let _rootStore = null
export function useStore(): RootStore {
  if (!_rootStore) {
    _rootStore = RootStoreModel.create({
      sidebar: "open",
      // connections: [],
      // orphanedCommands: [],
      // commandListeners: [],
    })
  }

  return _rootStore
}
