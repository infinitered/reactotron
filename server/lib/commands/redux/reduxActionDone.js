const COMMAND = 'redux.action.done'

/**
 Received when a redux action is complete.
 */
const process = (context, action) => {
  const {type, ms} = action.message
  const time = context.timeStamp()
  context.ui.reduxActionBox.log(`{white-fg}${time}{/} {blue-fg}action{/} ${type}{|}{white-fg}${ms}ms{/}`)
  if (context.reduxActionLoggingStyle === 'full') {
    context.ui.reduxActionBox.log(action.message.action)
    context.ui.reduxActionBox.log('')
  }
}

export default {
  name: COMMAND,
  process
}
