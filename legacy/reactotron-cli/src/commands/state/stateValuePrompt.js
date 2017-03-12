import RS from 'ramdasauce'
const COMMAND = 'state.value.prompt'

/**
 Prompts for a path to grab some state values from.
 */
const process = (context, action) => {
  context.ui.prompt('Enter a state path', (value) => {
    const path = RS.isNilOrEmpty(value) ? null : value
    context.post({type: 'state.value.request', path})
  })
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
