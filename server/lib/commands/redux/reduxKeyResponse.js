import RS from 'ramdasauce'
import R from 'ramda'

const COMMAND = 'redux.key.response'

/**
 Receives a list of keys from the server.
 */
const process = (context, action) => {
  const {path, keys} = action.message
  const time = context.timeStamp()

  const sayKeys = RS.isNilOrEmpty(keys)
    ? '{red-fg}(none){/}'
    : R.join(', ', R.map((k) => `${k}`, keys || []))

  const title = RS.isNilOrEmpty(path)
    ? '{blue-fg}keys in /{/}'
    : `{blue-fg}keys in ${path}{/}`

  const fullMessage = `{white-fg}${time}{/} ${title} ${sayKeys}`

  context.ui.logBox.log(fullMessage)
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
