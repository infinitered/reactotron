import R from 'ramda'
import RS from 'ramdasauce'
import { timeStamp } from './formatting'

/**
 Draws state.keys.response commands.
 */
export default (layout) => payload => {
  const {path, keys} = payload
  const time = timeStamp()

  const keyPrefix = RS.isNilOrEmpty(path) ? '' : `${path}.`

  const sayKeys = RS.isNilOrEmpty(keys)
    ? '  {red-fg}(no keys found at that path){/}'
    : R.join('\n', R.map((k) => `  ${keyPrefix}{cyan-fg}${k}{/}`, R.without([null], keys) || []))

  const title = RS.isNilOrEmpty(path)
    ? '{blue-fg}keys in /{/}'
    : `{blue-fg}keys in{/} {cyan-fg}${path}{/}`

  const fullMessage = `{white-fg}${time}{/} ${title} \n${sayKeys}`

  layout.logBox.log(fullMessage)
  layout.screen.render()
}
