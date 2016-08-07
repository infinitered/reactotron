const COMMAND = 'state.subscribe.clear'

/**
 Clears the subscriptions being watched.
 */
const process = (context, action) => {
  context.config.subscriptions = []
  context.post({type: 'state.subscribe.request'})
}

export default {
  name: COMMAND,
  process
}
