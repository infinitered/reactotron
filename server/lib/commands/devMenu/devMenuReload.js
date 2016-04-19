const COMMAND = 'devMenu.reload'

/**
 Sends a request to reload the app.
 */
const process = (context, action) => {
  context.send(action)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
