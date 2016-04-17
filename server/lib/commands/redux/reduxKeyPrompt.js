import RS from 'ramdasauce'
const COMMAND = 'redux.key.prompt'

/**
Prompts for a path to grab some redux keys from.
 */
const process = (context, action) => {
  context.prompt('Enter a redux path', (value) => {
    const path = RS.isNilOrEmpty(value) ? null : value
    context.post({type: 'redux.key.request', path})
  })
}

export default {
  name: COMMAND,
  repeatable: true,
  process
}
