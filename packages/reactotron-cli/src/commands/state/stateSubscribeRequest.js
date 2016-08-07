import R from 'ramda'
import RS from 'ramdasauce'

const COMMAND = 'state.subscribe.request'

/**
 Sends a request to get the keys at the path in state.
 */
const process = (context, action) => {
  const paths = R.without([null], RS.dotPath('config.subscriptions', context) || [])
  context.send('state.values.subscribe', {paths})
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
