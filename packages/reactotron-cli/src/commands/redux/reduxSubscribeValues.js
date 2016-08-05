import R from 'ramda'

const COMMAND = 'state.values.change'

/**
  Receive the subscribed key paths.
 */
const process = (context, action) => {
  context.log(action.payload)
  const { changes } = action.payload
  const each = R.map(change => `{cyan-fg}${change.path}{/}{|}{white-fg}${change.value}{/}`, changes)
  const message = R.join('\n', each)
  context.ui.reduxWatchBox.setContent(message)
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
