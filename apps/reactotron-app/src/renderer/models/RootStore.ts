import { type Instance, t } from "mobx-state-tree"

export const RootStoreModel = t
  .model({
    sidebar: t.enumeration(["open", "closed"]),
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
    })
  }

  return _rootStore
}
