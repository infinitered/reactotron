import RS from 'ramdasauce'

const COMMAND = 'redux.key.response'

/**
 Receives a list of keys from the server.
 */
const process = (context, action) => {
  const {path, keys} = action.message

  if (RS.isNilOrEmpty(path)) {
    context.reduxLog('', keys)
  } else {
    context.reduxLog(path, keys)
  }
}

export default {
  name: COMMAND,
  process
}
