import RS from 'ramdasauce'
const COMMAND = 'redux.subscribe.delete.prompt'

/**
 Prompts for a path to grab some redux keys from.
 */
const process = (context, action) => {
  context.ui.prompt('Enter a redux path:  eg. weather.temperature', (value) => {
    // logical default
    const path = RS.isNilOrEmpty(value) ? null : value
    context.post({type: 'redux.subscribe.delete', path: path})
  })
}

export default {
  name: COMMAND,
  process
}
