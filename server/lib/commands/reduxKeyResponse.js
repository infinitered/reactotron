import RS from 'ramdasauce'

const COMMAND = 'redux.key.response'

/**
 Receives a list of keys from the server.
 */
const process = (context, action) => {
  if (action.type !== COMMAND) return

  const {path, keys} = action.message

  if (RS.isNilOrEmpty(path)) {
    context.reduxLog('Redux Keys', keys)
  } else {
    context.reduxLog('Redux Keys | path = ' + path, keys)
  }
}

export default {process}
