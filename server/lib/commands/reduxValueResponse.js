import RS from 'ramdasauce'

const COMMAND = 'redux.value.response'
/**
 Receives some values inside redux.
 */
const process = (context, action) => {
  if (action.type !== COMMAND) return

  const {path, values} = action.message

  if (RS.isNilOrEmpty(path)) {
    context.log('Redux Response', values)
  } else {
    context.log('Redux Response | path = ' + path, values)
  }
}

export default {process}
