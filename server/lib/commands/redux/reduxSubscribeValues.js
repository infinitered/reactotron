import R from 'ramda'

const COMMAND = 'redux.subscribe.values'

/**
  Receive the subscribed key paths.
 */
const process = (context, action) => {
  const {values} = action.message
  const each = R.map(([k, v]) => `{blue-fg}${k}{/}{|}{white-fg}${v}{/}`, values)
  const message = R.join('\n', each)
  context.ui.reduxWatchBox.setContent(message)
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
