const COMMAND = 'log'

const process = (context, action) => {
  context.log(action.message)
}

export default {
  name: COMMAND,
  process
}
