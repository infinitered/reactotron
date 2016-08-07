const COMMAND = 'state.key.request'

/**
 Sends a request to get the keys at the path in state.
 */
const process = (context, action) => {
  context.send('state.keys.request', {path: action.path})
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
