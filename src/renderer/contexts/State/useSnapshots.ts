import { useContext, useEffect, useReducer, useCallback } from "react"
import { CommandType } from "reactotron-core-ui"
import { format } from "date-fns"
import produce from "immer"

import ReactotronContext, { Command } from "../Reactotron"

export interface Snapshot {
  id: number
  name: string
  state: any
}

interface SnapshotState {
  uniqueIdCounter: number
  snapshots: Snapshot[]
  renameingSnapshot: Snapshot
  isSnapshotRenameModalOpen: boolean
}

enum SnapshotActionType {
  SnapshotAdd = "SNAPSHOT_ADD",
  SnapshotRemove = "SNAPSHOT_REMOVE",
  SnapshotRename = "SNAPSHOT_RENAME",
  RenameModalOpen = "RENAME_MODAL_OPEN",
  RenameModalClose = "RENAME_MODAL_CLOSE",
}

type Action =
  | {
      type: SnapshotActionType.SnapshotAdd
      payload: Command
    }
  | { type: SnapshotActionType.SnapshotRemove; payload: Snapshot }
  | { type: SnapshotActionType.SnapshotRename; payload: string }
  | { type: SnapshotActionType.RenameModalOpen; payload: Snapshot }
  | { type: SnapshotActionType.RenameModalClose }

function timelineReducer(state: SnapshotState, action: Action) {
  switch (action.type) {
    case SnapshotActionType.SnapshotAdd:
      return produce(state, draftState => {
        draftState.snapshots.push({
          id: draftState.uniqueIdCounter++,
          name: action.payload.payload.name || format(new Date(), "EEEE @ h:mm:ss a"),
          state: action.payload.payload.state,
        })
      })
    case SnapshotActionType.SnapshotRemove:
      return produce(state, draftState => {
        const snapshotIndex = draftState.snapshots.findIndex(s => s.id === action.payload.id)

        if (snapshotIndex === -1) return

        draftState.snapshots = [
          ...draftState.snapshots.slice(0, snapshotIndex),
          ...draftState.snapshots.slice(snapshotIndex + 1),
        ]
      })
    case SnapshotActionType.SnapshotRename:
      return produce(state, draftState => {
        const snapshot = draftState.snapshots.find(s => s.id === draftState.renameingSnapshot.id)

        if (!snapshot) return

        snapshot.name = action.payload
        draftState.isSnapshotRenameModalOpen = false
      })
    case SnapshotActionType.RenameModalOpen:
      return produce(state, draftState => {
        draftState.renameingSnapshot = action.payload
        draftState.isSnapshotRenameModalOpen = true
      })
    case SnapshotActionType.RenameModalClose:
      return produce(state, draftState => {
        draftState.isSnapshotRenameModalOpen = false
      })
    default:
      return state
  }
}

function useSnapshots() {
  const { sendCommand, addCommandListener } = useContext(ReactotronContext)
  const [state, dispatch] = useReducer(timelineReducer, {
    uniqueIdCounter: 0,
    snapshots: [],
    renameingSnapshot: null,
    isSnapshotRenameModalOpen: false,
  })

  useEffect(() => {
    addCommandListener(command => {
      if (command.type !== CommandType.StateBackupResponse) return

      dispatch({
        type: SnapshotActionType.SnapshotAdd,
        payload: command,
      })
    })
  }, [addCommandListener])

  const createSnapshot = useCallback(() => {
    sendCommand("state.backup.request", {})
  }, [sendCommand])

  const restoreSnapshot = useCallback(
    (snapshot: Snapshot) => {
      if (!snapshot || !snapshot.state) return

      sendCommand("state.restore.request", { state: snapshot.state })
    },
    [sendCommand]
  )

  const removeSnapshot = useCallback(snapshot => {
    dispatch({
      type: SnapshotActionType.SnapshotRemove,
      payload: snapshot,
    })
  }, [])

  const renameSnapshot = useCallback((name: string) => {
    dispatch({
      type: SnapshotActionType.SnapshotRename,
      payload: name,
    })
  }, [])

  const openSnapshotRenameModal = useCallback((snapshot: Snapshot) => {
    dispatch({
      type: SnapshotActionType.RenameModalOpen,
      payload: snapshot,
    })
  }, [])

  const closeSnapshotRenameModal = useCallback(() => {
    dispatch({
      type: SnapshotActionType.RenameModalClose,
    })
  }, [])

  return {
    snapshots: state.snapshots,
    isSnapshotRenameModalOpen: state.isSnapshotRenameModalOpen,
    renameingSnapshot: state.renameingSnapshot,
    createSnapshot,
    restoreSnapshot,
    removeSnapshot,
    renameSnapshot,
    openSnapshotRenameModal,
    closeSnapshotRenameModal,
  }
}

export default useSnapshots
