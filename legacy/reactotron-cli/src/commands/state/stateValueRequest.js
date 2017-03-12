const COMMAND = 'state.value.request'

/**
 Sends a request to get the values at the path in state.
 */
const process = (context, action) => {
  context.server.stateValuesRequest(action.path)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
