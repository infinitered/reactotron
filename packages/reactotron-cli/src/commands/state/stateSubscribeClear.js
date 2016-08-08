const COMMAND = 'state.subscribe.clear'

/**
 Clears the subscriptions being watched.
 */
const process = (context, action) => {
  context.server.stateValuesClearSubscriptions()
}

export default {
  name: COMMAND,
  process
}
