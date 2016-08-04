import R from 'ramda'
import RS from 'ramdasauce'

// sends the key names at the given location
const handleKeysRequest = (state, reactotron, { path }) => {
  if (RS.isNilOrEmpty(path)) {
    reactotron.stateKeysResponse(null, R.keys(state))
  } else {
    const keys = R.keys(RS.dotPath(path, state))
    reactotron.stateKeysResponse(path, keys)
  }
}

// sends the values of the object located at the path
const handleValuesRequest = (state, reactotron, { path }) => {
  if (RS.isNilOrEmpty(path)) {
    // send the whole damn tree
    reactotron.stateValuesResponse(null, state)
  } else {
    // send a leaf of the tree
    reactotron.stateValuesResponse(path, RS.dotPath(path, state))
  }
}

const createPlugin = store => {
  // hold onto the send
  let capturedSend

  // here's the plugin
  const plugin = config => {
    // remember the plugin
    capturedSend = config.send
    return {
      onCommand: ({type, payload}) => {
        switch (type) {
          case 'state.keys.request':
            return handleKeysRequest(store.getState(), config.ref, payload)
          case 'state.values.request':
            return handleValuesRequest(store.getState(), config.ref, payload)
        }
      }
    }
  }

  // attach a function that we can call from the enhancer
  plugin.report = (action, ms) => {
    if (!capturedSend) return

    // let's call the type, name because that's "generic" name in Reactotron
    let { type: name } = action

    // convert from symbol to type if necessary
    if (typeof name === 'symbol') {
      name = name.toString().replace(/^Symbol\(/, '').replace(/\)$/, '')
    }

    // off ya go!
    capturedSend('state.action.complete', { name, action, ms })
  }

  return plugin
}

export default createPlugin
