import RS from 'ramdasauce'
const COMMAND = 'state.subscribe.add.prompt'

/**
 Prompts for a path to grab some state keys from.
 */
const process = (context, action) => {
  context.ui.prompt('Enter a state path:  eg. weather.temperature', (value) => {
    // logical default
    const path = RS.isNilOrEmpty(value) ? null : value
    context.post({type: 'state.subscribe.add', path: path})
  })
}

export default {
  name: COMMAND,
  process
}
