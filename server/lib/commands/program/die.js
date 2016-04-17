const COMMAND = 'program.die'

/**
  Shuts the program down.
 */
const execute = (context, action) => {
  const exitCode = action.exitCode || 0
  context.ui.screen.destroy()
  console.log('> You are eaten by a grue.')
  process.exit(exitCode)
}

export default {
  name: COMMAND,
  process: execute // remapped because of a node.js global variable collision
}
