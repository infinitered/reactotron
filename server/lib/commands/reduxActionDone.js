import moment from 'moment'
const COMMAND = 'redux.action.done'

/**
 Received when a redux action is complete.
 */
const process = (context, action) => {
  const {type, ms} = action.message
  const time = moment().format('HH:mm:ss.SSS')
  context.reduxLogRaw(`{white-fg}${time}{/} - {yellow-fg}${type}{/}{|}{white-fg}${ms}ms{/}`)
  if (context.reduxActionLoggingStyle === 'full') {
    context.reduxLogRaw(action.message.action)
    context.reduxLogRaw('')
  }
}

export default {
  name: COMMAND,
  process
}
