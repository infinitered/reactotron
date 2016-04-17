import R from 'ramda'
import RS from 'ramdasauce'
const COMMAND = 'redux.subscribe.add.prompt'

/**
Prompts for a path to grab some redux keys from.
 */
const process = (context, action) => {
  context.prompt('Enter a redux path:  eg. weather.temperature', (value) => {
    // logical default
    const path = RS.isNilOrEmpty(value) ? null : value
    // create the config.subscriptions unless it exist
    if (R.isNil(context.config.subscriptions)) {
      context.config.subscriptions = []
    }
    // subscribe
    if (!R.contains(path, context.config.subscriptions)) {
      context.config.subscriptions.push(path)
      context.post({type: 'redux.subscribe.request'})
    }
  })
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
