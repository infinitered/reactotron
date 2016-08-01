const COMMAND = 'state.action.complete'

/**
 Received when a redux action is complete.
 */
const process = (context, command) => {
  const {name, ms, action} = command.payload
  const time = context.timeStamp()
  context.ui.reduxActionBox.log(`${time} {cyan-fg}${name}{/}{|}{white-fg}${ms}{/}ms`)
  if (context.reduxActionLoggingStyle === 'full') {
    context.ui.reduxActionBox.log(action)
    context.ui.reduxActionBox.log('')
  }
}

export default {
  name: COMMAND,
  process
}
