import R from 'ramda'
const COMMAND = 'redux.subscribe.add'

/**
 Prompts for a path to grab some redux keys from.
 */
const process = (context, action) => {
  const path = action.path
  // create the config.subscriptions unless it exist
  if (R.isNil(context.config.subscriptions)) {
    context.config.subscriptions = []
  }
  // subscribe
  if (!R.contains(path, context.config.subscriptions)) {
    context.config.subscriptions.push(path)
    context.post({type: 'redux.subscribe.request'})
  }
}

export default {
  name: COMMAND,
  process
}
