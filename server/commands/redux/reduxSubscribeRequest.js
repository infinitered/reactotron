import R from 'ramda'
import RS from 'ramdasauce'
const COMMAND = 'redux.subscribe.request'
/**
 Sends a request to get the keys at the path in redux.
 */
const process = (context, action) => {
  const paths = R.without([null], RS.dotPath('config.subscriptions', context) || [])
  context.send(R.merge(action, {paths}))
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
