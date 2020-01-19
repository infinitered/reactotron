import { useReducer, useContext, useEffect } from "react"
import { CommandType } from "reactotron-core-ui"

import ReactotronContext, { Command } from "../Reactotron"
import produce from "immer"

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

enum CustomCommandsActionType {
  CommandAdd = "COMMAND_ADD",
  CommandRemove = "COMMAND_REMOVE",
}

type Action =
  | {
      type: CustomCommandsActionType.CommandAdd
      payload: Command
    }
  | { type: CustomCommandsActionType.CommandRemove; payload: Command }

function customCommandsReducer(state: CustomCommandState, action: Action) {
  switch (action.type) {
    case CustomCommandsActionType.CommandAdd:
      return produce(state, draftState => {
        draftState.customCommands.push({
          clientId: action.payload.clientId,
          ...action.payload.payload,
        })
      })
    case CustomCommandsActionType.CommandRemove:
      return produce(state, draftState => {
        const commandIndex = draftState.customCommands.findIndex(
          cc => cc.clientId === action.payload.clientId && cc.id === action.payload.payload.id
        )

        if (commandIndex === -1) return

        draftState.customCommands = [
          ...draftState.customCommands.slice(0, commandIndex),
          ...draftState.customCommands.slice(commandIndex + 1),
        ]
      })
    default:
      return state
  }
}

function useCustomCommands() {
  const { addCommandListener } = useContext(ReactotronContext)
  const [state, dispatch] = useReducer(customCommandsReducer, { customCommands: [] })

  useEffect(() => {
    addCommandListener(command => {
      if (command.type === CommandType.CustomCommandRegister) {
        dispatch({
          type: CustomCommandsActionType.CommandAdd,
          payload: command,
        })
      } else if (command.type === CommandType.CustomCommandUnregister) {
        dispatch({
          type: CustomCommandsActionType.CommandRemove,
          payload: command,
        })
      }
    })
  }, [addCommandListener])

  return {
    customCommands: state.customCommands,
  }
}

export default useCustomCommands
