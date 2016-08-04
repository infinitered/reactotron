import RS from 'ramdasauce'
import R from 'ramda'

const COMMAND = 'api.response'

const process = (context, action) => {
  const time = context.timeStamp()
  const status = RS.dotPath('response.status', action.payload)
  if (!R.is(Number, status)) {
    context.ui.apiBox.log(`${time} {red-fg}${status}{/}`)
    return
  }

  const url = RS.dotPath('request.url', action.payload)
  const rawMethod = RS.dotPath('request.method')(action.payload) || '???'
  const method = R.pipe(R.take(3), R.toUpper)(rawMethod)
  const statusMessage = R.cond([
    [RS.isWithin(200, 299), R.always(`{green-fg}${status}{/}`)],
    [RS.isWithin(400, 599), R.always(`{red-fg}${status}{/}`)],
    [R.T, R.identity]
  ])(status)
  const durationMs = RS.dotPath('duration', action.payload)
  const duration = `{white-fg}${durationMs}{/}ms`
  context.ui.apiBox.log(`${time} ${statusMessage} {blue-fg}${method}{/} ${url}{|}${duration}`)
  if (context.apiLoggingStyle === 'full') {
    const data = RS.dotPath('response.body', action.payload)
    if (R.is(Object, data)) {
      const json = JSON.stringify(data, null, 2)
      context.ui.apiBox.log(json)
    }
  }
}

export default {
  name: COMMAND,
  process
}
