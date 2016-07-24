import RS from 'ramdasauce'
const COMMAND = 'console.error'

/**
  Receives a console.error from the app.
 */
const process = (context, action) => {
  const {message} = action.message
  const time = context.timeStamp()
  const isWarning = RS.startsWith('Warning: ', message)
  const color = isWarning ? 'yellow' : 'red'
  context.ui.logBox.log(`${time} {${color}-fg}${message}{/}`)
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
