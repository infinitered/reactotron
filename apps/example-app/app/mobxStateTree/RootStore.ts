import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { LogoStoreModel } from "./LogoStore"
import { RepoStoreModel } from "./RepoStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  repo: types.optional(RepoStoreModel, {}),
  logo: types.optional(LogoStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
