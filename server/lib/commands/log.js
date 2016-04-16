const COMMAND = 'log'

const process = (context, action) => {
  context.log('Log Message', action.message)
}

export default {
  name: COMMAND,
  process
}
