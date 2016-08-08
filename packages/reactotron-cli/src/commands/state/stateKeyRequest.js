const COMMAND = 'state.key.request'

/**
 Sends a request to get the keys at the path in state.
 */
const process = (context, action) => {
  context.server.stateKeysRequest(action.path)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
