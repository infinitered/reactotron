import produce from "immer"

import { Command } from "../Reactotron"

export enum ActionTypes {
  AddConnection = "ADD_CONNECTION",
  RemoveConnection = "REMOVE_CONNECTION",
  ClearConnectionCommands = "CLEAR_CONNECTION_COMMANDS", // TODO: Implement.
  CommandReceived = "COMMAND_RECEIVED",
  ChangeSelectedConnectionId = "CHANGE_SELECTED_CONNECTION_ID", // TODO: Implement.
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
  orphanedCommands: Command[]
}

interface Action {
  type: ActionTypes
  payload: any
}

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

        const connection = draftState.connections.find(c => c.clientId === action.payload.clientId)

        connection.commands.push(action.payload)
      })
    default:
      return state
  }
}

export function clientConnected(connection: ReactotronConnection) {
  return {
    type: ActionTypes.AddConnection,
    payload: connection,
  }
}

export function clientDisconnected(connection: ReactotronConnection) {
  return {
    type: ActionTypes.RemoveConnection,
    payload: connection,
  }
}

export function commandReceived(command: Command) {
  return {
    type: ActionTypes.CommandReceived,
    payload: command,
  }
}
