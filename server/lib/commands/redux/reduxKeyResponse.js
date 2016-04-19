import RS from 'ramdasauce'
import R from 'ramda'

const COMMAND = 'redux.key.response'

/**
 Receives a list of keys from the server.
 */
const process = (context, action) => {
  const {path, keys} = action.message
  const time = context.timeStamp()

  const keyPrefix = RS.isNilOrEmpty(path) ? '' : `${path}.`

  const sayKeys = RS.isNilOrEmpty(keys)
    ? '  {red-fg}(no keys found at that path){/}'
    : R.join('\n', R.map((k) => `  ${keyPrefix}{cyan-fg}${k}{/}`, R.without([null], keys) || []))

  const title = RS.isNilOrEmpty(path)
    ? '{blue-fg}keys in /{/}'
    : `{blue-fg}keys in{/} {cyan-fg}${path}{/}`

  const fullMessage = `{white-fg}${time}{/} ${title} \n${sayKeys}`

  context.ui.logBox.log(fullMessage)
  context.ui.screen.render()
}

export default {
  name: COMMAND,
  process
}
