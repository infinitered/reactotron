// Creates a replacement reducer so we can listen for Reactotron messages
// to clobber the state from the outside.
export const DEFAULT_REPLACER_TYPE = 'REACTOTRON_RESTORE_STATE'

// creates a reducer which wraps the passed rootReducer
export default (rootReducer, actionName = DEFAULT_REPLACER_TYPE) => {
  // return this reducer
  return (state, action) => {
    // is this action the one we're waiting for?  if so, use the state it passed
    const whichState = action.type === actionName ? action.state : state
    return rootReducer(whichState, action)
  }
}
