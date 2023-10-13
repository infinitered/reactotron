export const DEFAULT_REPLACER_TYPE = "REACTOTRON_RESTORE_STATE"

export default function reactotronReducer(
  // eslint-disable-next-line @typescript-eslint/ban-types
  rootReducer: Function,
  actionName = DEFAULT_REPLACER_TYPE
) {
  // return this reducer
  return (state: any, action: { type: string; state?: any }) => {
    // is this action the one we're waiting for?  if so, use the state it passed
    const whichState = action.type === actionName ? action.state : state
    return rootReducer(whichState, action)
  }
}
