import R from 'ramda'
const COMMAND = 'state.subscribe.delete'

/**
 Prompts for a path to grab some state keys from.
 */
const process = (context, action) => {
  const path = action.path
  // create the config.subscriptions unless it exist
  if (R.isNil(context.config.subscriptions)) {
    context.config.subscriptions = []
  }
  // remove
  context.config.subscriptions = R.without([path], context.config.subscriptions)
  // refresh
  context.post({type: 'state.subscribe.request'})
}

export default {
  name: COMMAND,
  process
}
