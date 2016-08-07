const COMMAND = 'state.dispatch'

/**
 Sends a request to dispatch an action into state.
 */
const process = (context, action) => {
  context.send('state.action.dispatch', { action: action.action })
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
