import RS from 'ramdasauce'
import R from 'ramda'
const COMMAND = 'api.log'

const process = (context, action) => {
  const time = context.timeStamp()
  const problem = RS.dotPath('response.problem', action.message)
  const status = RS.dotPath('response.status', action.message)
  if (!R.is(Number, status)) {
    context.ui.apiBox.log(`{white-fg}${time}{/} - {red-fg}${problem}{/}`)
    return
  }

  const url = RS.dotPath('response.config.url', action.message)
  const baseURL = RS.dotPath('response.config.baseURL', action.message)
  const path = R.replace(baseURL, '', url)

  const rawMethod = RS.dotPath('response.config.method')(action.message) || '???'
  const method = R.pipe(R.take(3), R.toUpper)(rawMethod)
  const statusMessage = R.cond([
    [RS.isWithin(200, 299), R.always(`{green-fg}${status}{/}`)],
    [RS.isWithin(400, 599), R.always(`{red-fg}${status}{/}`)],
    [R.T, R.identity]
  ])(status)
  context.ui.apiBox.log(`{white-fg}${time}{/} - {blue-fg}${method}{/} ${path}{|}${statusMessage}`)
  if (context.apiLoggingStyle === 'full') {
    const data = RS.dotPath('response.data', action.message)
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
