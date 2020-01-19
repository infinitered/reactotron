import { useContext, useEffect, useReducer, useCallback } from "react"
import { CommandType } from "reactotron-core-ui"
import { format } from "date-fns"
import produce from "immer"

import ReactotronContext, { Command } from "../Reactotron"
import StandaloneContext from "../Standalone"

export interface Snapshot {
  id: number
  name: string
  state: any
}

interface TimelineState {
  uniqueIdCounter: number
  snapshots: Snapshot[]
}

enum SnapshotActionType {
  SnapshotAdd = "SNAPSHOT_ADD",
  SnapshotRemove = "SNAPSHOT_REMOVE",
}

type Action =
  | {
      type: SnapshotActionType.SnapshotAdd
      payload: Command
    }
  | { type: SnapshotActionType.SnapshotRemove; payload: Snapshot }

function timelineReducer(state: TimelineState, action: Action) {
  switch (action.type) {
    case SnapshotActionType.SnapshotAdd:
      return produce(state, draftState => {
        draftState.snapshots.push({
          id: draftState.uniqueIdCounter++,
          name: action.payload.payload.name || format(new Date(), "dddd @ h:mm:ss a"),
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
    default:
      return state
  }
}

function useSnapshots() {
  // TODO: Get this standalone usage out of here!
  const { sendCommand } = useContext(StandaloneContext)
  const { addCommandListener } = useContext(ReactotronContext)
  const [state, dispatch] = useReducer(timelineReducer, { uniqueIdCounter: 0, snapshots: [] })

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

  return {
    snapshots: state.snapshots,
    createSnapshot,
    restoreSnapshot,
    removeSnapshot,
  }
}

export default useSnapshots
