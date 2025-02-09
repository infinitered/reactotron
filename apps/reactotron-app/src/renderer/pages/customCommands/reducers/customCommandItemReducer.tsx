import { produce } from "immer"
import { CustomCommandArg } from "reactotron-core-client"

export enum CustomCommandItemActionType {
  UPDATE_ARG = "UPDATE_ARG",
}

export type CustomCommandItemState = {
  [argName: string]: string
}
export type CustomCommandItemActionPayload = {
  argName: string
  value: string
}
export type CustomCommandItemAction = {
  type: CustomCommandItemActionType
  payload: CustomCommandItemActionPayload
}

export function customCommandItemReducer(
  state: CustomCommandItemState,
  action: CustomCommandItemAction
) {
  switch (action.type) {
    case CustomCommandItemActionType.UPDATE_ARG:
      return produce(state, (draftState) => {
        draftState[action.payload.argName] = action.payload.value
      })
    default:
      return state
  }
}

export function customCommandItemReducerInitializer(args: CustomCommandArg[]) {
  if (!args) {
    return {}
  }
  return args.reduce<CustomCommandItemState>((acc, arg) => {
    acc[arg.name] = ""
    return acc
  }, {})
}
