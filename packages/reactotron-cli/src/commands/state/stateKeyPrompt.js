import RS from 'ramdasauce'
const COMMAND = 'state.key.prompt'

/**
 Prompts for a path to grab some state keys from.
 */
const process = (context, action) => {
  context.ui.prompt('Enter a state path:  eg. weather.temperature', (value) => {
    const path = RS.isNilOrEmpty(value) ? null : value
    context.post({type: 'state.key.request', path})
  })
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
