const COMMAND = 'api.log'

const process = (context, action) => {
  context.apiLog('API', action.message)
}

export default {
  name: COMMAND,
  process
}
