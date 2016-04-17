const COMMAND = 'program.die'

const process = (context, action) => {
  const exitCode = action.exitCode || 0
  context.screen.destroy()
  console.log('> You are eaten by a grue.')
  process.exit(exitCode)
}

export default {
  name: COMMAND,
  process
}
