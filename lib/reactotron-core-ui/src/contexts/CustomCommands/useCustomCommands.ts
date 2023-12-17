import { useReducer, useContext, useEffect } from "react"
import { produce } from "immer"

import type { Command } from "reactotron-core-contract"
import { CommandType } from "reactotron-core-contract"
import ReactotronContext from "../Reactotron"

export interface CustomCommand {
  clientId: string
  id: string
  title?: string
  command: string
  description?: string
  args?: {
    name: string
  }[]
}

interface CustomCommandState {
  customCommands: CustomCommand[]
}

type Action =
  | { type: "COMMAND_ADD"; payload: Command }
  | { type: "COMMAND_REMOVE"; payload: Command }
  | { type: "COMMAND_CLEAR"; payload: string }

function customCommandsReducer(state: CustomCommandState, action: Action) {
  switch (action.type) {
    case "COMMAND_ADD":
      return produce(state, (draftState) => {
        draftState.customCommands.push({
          clientId: action.payload.clientId,
          ...action.payload.payload,
        })
      })
    case "COMMAND_REMOVE":
      return produce(state, (draftState) => {
        const commandIndex = draftState.customCommands.findIndex(
          (cc) => cc.clientId === action.payload.clientId && cc.id === action.payload.payload.id
        )

        if (commandIndex === -1) return

        draftState.customCommands = [
          ...draftState.customCommands.slice(0, commandIndex),
          ...draftState.customCommands.slice(commandIndex + 1),
        ]
      })
    case "COMMAND_CLEAR":
      return produce(state, (draftState) => {
        draftState.customCommands = draftState.customCommands.filter(
          (cc) => cc.clientId !== action.payload
        )
      })
    default:
      return state
  }
}

function useCustomCommands() {
  const { addCommandListener } = useContext(ReactotronContext)
  const [state, dispatch] = useReducer(customCommandsReducer, { customCommands: [] })

  useEffect(() => {
    addCommandListener((command) => {
      if (command.type === CommandType.ClientIntro) {
        dispatch({ type: "COMMAND_CLEAR", payload: command.clientId })
      } else if (command.type === CommandType.CustomCommandRegister) {
        dispatch({ type: "COMMAND_ADD", payload: command })
      } else if (command.type === CommandType.CustomCommandUnregister) {
        dispatch({ type: "COMMAND_REMOVE", payload: command })
      }
    })
  }, [addCommandListener])

  return {
    customCommands: state.customCommands,
  }
}

export default useCustomCommands
