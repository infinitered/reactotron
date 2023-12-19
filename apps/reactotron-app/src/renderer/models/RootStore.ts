import { type Instance, t } from "mobx-state-tree"

export const RootStoreModel = t
  .model({
    sidebar: t.enumeration(["open", "closed"] as const),
    serverStatus: t.enumeration(["stopped", "started", "portUnavailable"] as const),
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
    setServerStatus(status: typeof store.serverStatus) {
      store.serverStatus = status
    },
  }))

export type RootStore = Instance<typeof RootStoreModel>

// Singleton
let _rootStore = null
export function useStore(): RootStore {
  if (!_rootStore) {
    _rootStore = RootStoreModel.create({
      sidebar: "open",
      serverStatus: "stopped",
    })
  }

  return _rootStore
}
