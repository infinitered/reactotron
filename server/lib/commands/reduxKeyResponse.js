import RS from 'ramdasauce'

const COMMAND = 'redux.key.response'

/**
 Receives a list of keys from the server.
 */
const process = (context, action) => {
  if (action.type !== COMMAND) return

  const {path, keys} = action.message

  if (RS.isNilOrEmpty(path)) {
    context.log('Redux Keys', keys)
  } else {
    context.log('Redux Keys | path = ' + path, keys)
  }
}

export default {process}
