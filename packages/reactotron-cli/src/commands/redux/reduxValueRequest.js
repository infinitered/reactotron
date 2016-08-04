const COMMAND = 'redux.value.request'

/**
 Sends a request to get the values at the path in redux.
 */
const process = (context, action) => {
  context.send('state.values.request', {path: action.path})
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
