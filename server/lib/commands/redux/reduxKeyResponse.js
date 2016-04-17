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
    : R.join(', ', R.map((k) => `{yellow-fg}${k}{/}`, keys || []))

  const title = RS.isNilOrEmpty(path)
    ? '{blue-fg}keys{/}'
    : `{blue-fg}keys{/} {bold}{white-fg}${path}{/}{/}`

  const fullMessage = `{white-fg}${time}{/} - ${title} ${sayKeys}`

  context.reduxBox.log(fullMessage)
  context.screen.render()
}

export default {
  name: COMMAND,
  process
}
