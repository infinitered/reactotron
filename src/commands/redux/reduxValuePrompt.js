import RS from 'ramdasauce'
const COMMAND = 'redux.value.prompt'

/**
 Prompts for a path to grab some redux values from.
 */
const process = (context, action) => {
  context.prompt('Enter a redux path', (value) => {
    const path = RS.isNilOrEmpty(value) ? null : value
    context.post({type: 'redux.value.request', path})
  })
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
