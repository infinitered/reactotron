import RS from 'ramdasauce'
const COMMAND = 'redux.dispatch.prompt'

/**
Prompts for a path to grab some redux keys from.
 */
const process = (context, action) => {
  context.prompt('Action to dispatch', (value) => {
    let action = null
    eval('action = ' + value) // lulz
    if (RS.isNilOrEmpty(action)) return
    // TODO: validate. omg srsly
    context.post({type: 'redux.dispatch', action})
  })
}

export default {
  name: COMMAND,
  process
}
