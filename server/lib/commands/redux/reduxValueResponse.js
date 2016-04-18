import RS from 'ramdasauce'

const COMMAND = 'redux.value.response'

/**
 Receives some values inside redux.
 */
const process = (context, action) => {
  const {path, values} = action.message
  const time = context.timeStamp()
  if (RS.isNilOrEmpty(path)) {
    context.ui.logBox.log(`{white-fg}${time}{/} - {blue-fg}values in /{/}`)
  } else {
    context.ui.logBox.log(`{white-fg}${time}{/} - {blue-fg}values in ${path}{/}`)
  }
  context.ui.logBox.log(values)
  context.ui.logBox.log('')
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
