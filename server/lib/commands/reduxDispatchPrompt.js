import R from 'ramda'
import RS from 'ramdasauce'
const COMMAND = 'redux.dispatch.prompt'

/**
Prompts for a path to grab some redux keys from.
 */
const process = (context, action) => {
  context.prompt('Action to dispatch', (value) => {
    let action = null

    // try not to blow up the frame
    try {
      eval('action = ' + value) // lulz
    } catch (e) {
    }

    // try harder to not blow up the frame
    if (RS.isNilOrEmpty(action)) return

    // got an object?  ship an object.
    context.post({type: 'redux.dispatch', action})
  })
}

export default {
  name: COMMAND,
  process
}
