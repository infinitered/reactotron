const COMMAND = 'die'

const process = (context, action) => {
  context.die()
}

export default {
  name: COMMAND,
  process
}
