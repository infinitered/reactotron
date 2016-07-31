const COMMAND = 'log'

const process = (context, action) => {
  const { message, level } = action.payload
  context.log(message, level)
}

export default {
  name: COMMAND,
  process
}
