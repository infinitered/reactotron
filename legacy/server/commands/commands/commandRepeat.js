const COMMAND = 'command.repeat'

const process = (context, action) => {
  const lastRepeatableMessage = context.lastRepeatableMessage
  if (lastRepeatableMessage) {
    context.post(lastRepeatableMessage)
  }
}

export default {
  name: COMMAND,
  process
}
