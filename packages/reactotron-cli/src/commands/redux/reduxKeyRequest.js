const COMMAND = 'redux.key.request'

/**
 Sends a request to get the keys at the path in redux.
 */
const process = (context, action) => {
  context.send(action)
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
