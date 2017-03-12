const COMMAND = 'state.subscribe.add'

/**
 * Subscribes to a path in the client state.
 */
const process = (context, { path }) => {
  context.server.stateValuesSubscribe(path)
}

export default {
  name: COMMAND,
  process
}
