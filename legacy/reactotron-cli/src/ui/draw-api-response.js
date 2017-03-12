import R from 'ramda'
import RS from 'ramdasauce'
import { timeStamp } from './formatting'

/**
 * Draws the API response.
 */
export default (layout, config) => payload => {
  const time = timeStamp()
  const status = RS.dotPath('response.status', payload)
  // not even a status!
  if (!R.is(Number, status)) {
    layout.apiBox.log(`${time} {red-fg}${status}{/}`)
    return
  }

  const url = RS.dotPath('request.url', payload)
  const rawMethod = RS.dotPath('request.method')(payload) || '???'
  const method = R.pipe(R.take(3), R.toUpper)(rawMethod)
  const statusMessage = R.cond([
    [RS.isWithin(200, 299), R.always(`{green-fg}${status}{/}`)],
    [RS.isWithin(400, 599), R.always(`{red-fg}${status}{/}`)],
    [R.T, R.identity]
  ])(status)
  const durationMs = RS.dotPath('duration', payload)
  const duration = `{white-fg}${durationMs}{/}ms`

  layout.apiBox.log(`${time} ${statusMessage} {blue-fg}${method}{/} ${url}{|}${duration}`)
  if (config.apiLoggingStyle === 'full') {
    const data = RS.dotPath('response.body', payload)
    if (R.is(Object, data)) {
      const json = JSON.stringify(data, null, 2)
      layout.apiBox.log(json)
    }
  }
}
