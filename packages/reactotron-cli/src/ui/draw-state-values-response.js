import RS from 'ramdasauce'
import { timeStamp } from './formatting'

/**
 Draws state.values.response commands.
 */
export default (layout) => payload => {
  const {path, value} = payload
  const time = timeStamp()
  if (RS.isNilOrEmpty(path)) {
    layout.logBox.log(`{white-fg}${time}{/} {blue-fg}values in{/} {cyan-fg}/{/}`)
  } else {
    layout.logBox.log(`{white-fg}${time}{/} {blue-fg}values in{/} {cyan-fg}${path}{/}`)
  }
  layout.logBox.log(value)
  layout.logBox.log('')
  layout.screen.render()
}
