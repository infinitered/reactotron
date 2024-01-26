import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const LogoStoreModel = types
  .model("LogoStore")
  .props({
    size: types.optional(types.number, 80),
    speed: types.optional(types.number, 25),
  })
  .actions((store) => ({
    faster: () => {
      store.speed = 10
    },
    slower: () => {
      store.speed = 50
    },
    bigger: () => {
      store.size = 140
    },
    smaller: () => {
      store.size = 40
    },
    reset: () => {
      store.size = 80
      store.speed = 25
    },
  }))

export interface LogoStore extends Instance<typeof LogoStoreModel> {}
export interface LogoStoreSnapshot extends SnapshotOut<typeof LogoStoreModel> {}

// @demo remove-file
