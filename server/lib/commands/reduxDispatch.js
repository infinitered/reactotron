const COMMAND = 'redux.dispatch'

/**
 Sends a request to dispatch an action into Redux.
 */
const process = (context, action) => {
  context.send(action)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
