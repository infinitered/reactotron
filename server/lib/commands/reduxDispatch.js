const COMMAND = 'redux.dispatch'

/**
 Sends a request to dispatch an action into Redux.
 */
const process = (context, action) => {
  if (action.type !== COMMAND) return
  context.send(action)
}

export default {process}
