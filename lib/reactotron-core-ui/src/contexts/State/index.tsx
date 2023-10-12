import React, { FunctionComponent } from "react"

import useSubscriptions from "./useSubscriptions"
import useSnapshots, { Snapshot } from "./useSnapshots"

interface Context {
  subscriptions: string[]
  addSubscription: (path: string) => void
  removeSubscription: (path: string) => void
  clearSubscriptions: () => void
  snapshots: Snapshot[]
  isSnapshotRenameModalOpen: boolean
  renameingSnapshot: Snapshot
  createSnapshot: () => void
  restoreSnapshot: (snapshot: Snapshot) => void
  removeSnapshot: (snapshot: Snapshot) => void
  renameSnapshot: (name: string) => void
  openSnapshotRenameModal: (snapshot: Snapshot) => void
  closeSnapshotRenameModal: () => void
}

const StateContext = React.createContext<Context>({
  subscriptions: [],
  addSubscription: null,
  removeSubscription: null,
  clearSubscriptions: null,
  snapshots: [],
  isSnapshotRenameModalOpen: false,
  renameingSnapshot: null,
  createSnapshot: null,
  restoreSnapshot: null,
  removeSnapshot: null,
  renameSnapshot: null,
  openSnapshotRenameModal: null,
  closeSnapshotRenameModal: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const { subscriptions, addSubscription, removeSubscription, clearSubscriptions } =
    useSubscriptions()

  const {
    snapshots,
    isSnapshotRenameModalOpen,
    renameingSnapshot,
    createSnapshot,
    restoreSnapshot,
    removeSnapshot,
    renameSnapshot,
    openSnapshotRenameModal,
    closeSnapshotRenameModal,
  } = useSnapshots()

  return (
    <StateContext.Provider
      value={{
        subscriptions,
        addSubscription,
        removeSubscription,
        clearSubscriptions,
        snapshots,
        isSnapshotRenameModalOpen,
        renameingSnapshot,
        createSnapshot,
        restoreSnapshot,
        removeSnapshot,
        renameSnapshot,
        openSnapshotRenameModal,
        closeSnapshotRenameModal,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export default StateContext
export const StateProvider = Provider
