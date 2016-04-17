const COMMAND = 'content.log'

const process = (context, action) => {
  context.log(action.message)
}

export default {
  name: COMMAND,
  process
}
