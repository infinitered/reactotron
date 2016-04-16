import RS from 'ramdasauce'

const COMMAND = 'redux.value.response'

/**
 Receives some values inside redux.
 */
const process = (context, action) => {
  const {path, values} = action.message

  if (RS.isNilOrEmpty(path)) {
    context.reduxLog('Redux Response', values)
  } else {
    context.reduxLog('Redux Response | path = ' + path, values)
  }
}

export default {
  name: COMMAND,
  process
}
