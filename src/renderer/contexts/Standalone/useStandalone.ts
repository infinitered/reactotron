import { useCallback, useReducer } from "react"

import { Command } from "../Reactotron"

import {
  ReactotronConnection,
  reducer,
  clientConnected,
  commandReceived,
  clientDisconnected,
  clearConnectionCommands,
  updateSelectConnection,
  addCommandHandler,
} from "./manager"

function useStandalone() {
  const [state, dispatch] = useReducer(reducer, {
    connections: [],
    selectedClientId: null,
    orphanedCommands: [],
    commandListeners: [],
  })

  // Called when we have client details. NOTE: Commands can start flying in before this gets called!
  const handleConnectionEstablished = useCallback((connection: ReactotronConnection) => {
    dispatch(clientConnected(connection))
  }, [])

  // Called when commands are flowing in.
  const handleCommand = useCallback((command: Command) => {
    dispatch(commandReceived(command))
  }, [])

  // Called when a client disconnects. NOTE: They could be coming back. This could happen with a reload of the simulator!
  const handleDisconnect = useCallback((connection: ReactotronConnection) => {
    dispatch(clientDisconnected(connection))
  }, [])

  const clearSelectedConnectionCommands = useCallback(() => {
    dispatch(clearConnectionCommands())
  }, [])

  const selectConnection = useCallback((clientId: string) => {
    dispatch(updateSelectConnection(clientId))
  }, [])

  const addCommandListener = useCallback((callback: (command: Command) => void) => {
    dispatch(addCommandHandler(callback))
  }, [])

  return {
    ...state,
    selectedConnection: state.connections.find(c => c.clientId === state.selectedClientId),
    clearSelectedConnectionCommands,
    selectConnection,
    handleConnectionEstablished,
    handleCommand,
    handleDisconnect,
    addCommandListener,
  }
}

export default useStandalone
