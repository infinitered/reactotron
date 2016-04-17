const COMMAND = 'redux.action.done'

/**
 Received when a redux action is complete.
 */
const process = (context, action) => {
  const {type, ms} = action.message
  const time = context.timeStamp()
  context.ui.reduxBox.log(`{white-fg}${time}{/} - {blue-fg}action{/} ${type}{|}{white-fg}${ms}ms{/}`)
  if (context.reduxActionLoggingStyle === 'full') {
    context.ui.reduxBox.log(action.message.action)
    context.ui.reduxBox.log('')
  }
}

export default {
  name: COMMAND,
  process
}
