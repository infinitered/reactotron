const COMMAND = 'redux.value.request'

/**
 Sends a request to get the values at the path in redux.
 */
const process = (context, action) => {
  context.send(action)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
