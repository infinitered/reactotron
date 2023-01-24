import { useCallback, useReducer } from "react"
import produce from "immer"

export enum ActionTypes {
  AddConnection = "ADD_CONNECTION",
  RemoveConnection = "REMOVE_CONNECTION",
  ClearConnectionCommands = "CLEAR_CONNECTION_COMMANDS",
  CommandReceived = "COMMAND_RECEIVED",
  ChangeSelectedClientId = "CHANGE_SELECTED_CLIENT_ID",
  AddCommandHandler = "ADD_COMMAND_HANDLER",
}

export interface ReactotronConnection {
  // Stuff shipped from core-server
  id: number
  clientId: string

  // TODO: Nullable maybe?
  platform: "ios" | "android" | "browser"
  name?: string
  platformVersion?: string
  osRelease?: string
  userAgent?: string
}

export interface Connection extends ReactotronConnection {
  // Stuff that reactotron adds
  commands: any[]
  connected: boolean
}

interface State {
  connections: Connection[]
  selectedClientId: string
  orphanedCommands: any[] // Command[]
  commandListeners: ((command: any) => void)[] // ((command: Command) => void)[]
}

type Action =
  | {
      type: ActionTypes.AddConnection | ActionTypes.RemoveConnection
      payload: ReactotronConnection
    }
  | { type: ActionTypes.ChangeSelectedClientId; payload: string }
  | { type: ActionTypes.CommandReceived; payload: any } // TODO: Type this better!
  | { type: ActionTypes.ClearConnectionCommands }
  | { type: ActionTypes.AddCommandHandler; payload: (command: any) => void }

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.AddConnection:
      return produce(state, draftState => {
        let existingConnection = draftState.connections.find(
          c => c.clientId === action.payload.clientId
        )

        if (existingConnection) {
          existingConnection.connected = true
        } else {
          existingConnection = {
            ...action.payload,
            commands: [],
            connected: true,
          }

          draftState.connections.push(existingConnection)
        }

        if (draftState.orphanedCommands.length > 0) {
          // TODO: Make this better... filtering this list twice probably is a terrible idea.
          const orphanedCommands = draftState.orphanedCommands.filter(
            oc => oc.connectionId === action.payload.id
          )

          // TODO: Consider if we need to do a one time sort of these... just in case.
          existingConnection.commands.push(...orphanedCommands)

          draftState.orphanedCommands = draftState.orphanedCommands.filter(
            oc => oc.connectionId !== action.payload.id
          )
        }

        // TODO: Figure out if we can stop having these dumb commands so early. Make core client only send once we actually have a client ID! (maybe won't work for flipper if it doesn't assign client id? Maybe that is how this broke?!?)

        const filteredConnections = draftState.connections.filter(c => c.connected)

        if (filteredConnections.length === 1) {
          draftState.selectedClientId = filteredConnections[0].clientId
        }
      })
    case ActionTypes.RemoveConnection:
      return produce(state, draftState => {
        const existingConnection = draftState.connections.find(
          c => c.clientId === action.payload.clientId
        )

        if (!existingConnection) return

        existingConnection.connected = false

        if (draftState.selectedClientId === action.payload.clientId) {
          const filteredConnections = draftState.connections.filter(c => c.connected)

          if (filteredConnections.length > 0) {
            draftState.selectedClientId = filteredConnections[0].clientId
          } else {
            draftState.selectedClientId = null
          }
        }
      })
    case ActionTypes.CommandReceived:
      return produce(state, draftState => {
        if (!action.payload.clientId) {
          draftState.orphanedCommands.push(action.payload)
          return
        }

        draftState.commandListeners.forEach(cl => cl(action.payload))

        const connection = draftState.connections.find(c => c.clientId === action.payload.clientId)

        connection.commands = [action.payload, ...connection.commands]
      })
    case ActionTypes.ClearConnectionCommands:
      return produce(state, draftState => {
        if (!draftState.selectedClientId) return

        const selectedConnection = draftState.connections.find(
          c => c.clientId === draftState.selectedClientId
        )

        if (!selectedConnection) return

        selectedConnection.commands = []
      })
    case ActionTypes.ChangeSelectedClientId:
      return produce(state, draftState => {
        const selectedConnection = draftState.connections.find(c => c.clientId === action.payload)

        if (!selectedConnection) return

        draftState.selectedClientId = action.payload
      })
    case ActionTypes.AddCommandHandler:
      return produce(state, draftState => {
        draftState.commandListeners.push(action.payload)
      })
    default:
      return state
  }
}

function useStandalone() {
  const [state, dispatch] = useReducer(reducer, {
    connections: [],
    selectedClientId: null,
    orphanedCommands: [],
    commandListeners: [],
  })

  // Called when we have client details. NOTE: Commands can start flying in before this gets called!
  const connectionEstablished = useCallback((connection: ReactotronConnection) => {
    dispatch({
      type: ActionTypes.AddConnection,
      payload: connection,
    })
  }, [])

  // Called when commands are flowing in.
  const commandReceived = useCallback((command: any) => {
    dispatch({ type: ActionTypes.CommandReceived, payload: command })
  }, [])

  // Called when a client disconnects. NOTE: They could be coming back. This could happen with a reload of the simulator!
  const connectionDisconnected = useCallback((connection: ReactotronConnection) => {
    dispatch({ type: ActionTypes.RemoveConnection, payload: connection })
  }, [])

  const clearSelectedConnectionCommands = useCallback(() => {
    dispatch({ type: ActionTypes.ClearConnectionCommands })
  }, [])

  const selectConnection = useCallback((clientId: string) => {
    dispatch({ type: ActionTypes.ChangeSelectedClientId, payload: clientId })
  }, [])

  const addCommandListener = useCallback((callback: (command: any) => void) => {
    dispatch({ type: ActionTypes.AddCommandHandler, payload: callback })
  }, [])

  return {
    ...state,
    selectedConnection: state.connections.find(c => c.clientId === state.selectedClientId),
    selectConnection,
    connectionEstablished,
    connectionDisconnected,
    commandReceived,
    clearSelectedConnectionCommands,
    addCommandListener,
  }
}

export default useStandalone
