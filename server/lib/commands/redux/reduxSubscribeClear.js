const COMMAND = 'redux.subscribe.clear'
/**
  Clears the subscriptions being watched.
 */
const process = (context, action) => {
  context.config.subscriptions = []
  context.post({type: 'redux.subscribe.request'})
}

export default {
  name: COMMAND,
  process
}
