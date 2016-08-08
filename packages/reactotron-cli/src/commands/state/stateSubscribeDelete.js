const COMMAND = 'state.subscribe.delete'

/**
 * Removes a subscription.
 */
const process = (context, { path }) => {
  context.server.stateValuesUnsubscribe(path)
}

export default {
  name: COMMAND,
  process
}
