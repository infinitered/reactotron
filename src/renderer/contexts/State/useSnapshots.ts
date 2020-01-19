import { useContext, useEffect, useReducer, useCallback } from "react"
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
}

interface TimelineAction {
  type: SnapshotActionType
  payload?: Command
}

function timelineReducer(state: TimelineState, action: TimelineAction) {
  switch (action.type) {
    case SnapshotActionType.SnapshotAdd:
      return produce(state, draftState => {
        draftState.snapshots.push({
          id: draftState.uniqueIdCounter++,
          name: action.payload.payload.name || format(new Date(), "dddd @ h:mm:ss a"),
          state: action.payload.payload.state,
        })
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
      // TODO: Switch to the command type when the new core-ui is in!
      if (command.type !== "state.backup.response") return

      dispatch({
        type: SnapshotActionType.SnapshotAdd,
        payload: command,
      })
    })
  }, [addCommandListener])

  const createSnapshot = useCallback(() => {
    sendCommand("state.backup.request", {})
  }, [sendCommand])

  return {
    snapshots: state.snapshots,
    createSnapshot,
  }
}

export default useSnapshots
