const COMMAND = 'state.dispatch'

/**
 Sends a request to dispatch an action into state.
 */
const process = (context, { action }) => {
  context.server.stateActionDispatch(action)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
