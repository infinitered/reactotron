const COMMAND = 'redux.value.request'

/**
 Sends a request to get the values at the path in redux.
 */
const process = (context, action) => {
  if (action.type !== COMMAND) return
  context.send(action)
}

export default {process}
