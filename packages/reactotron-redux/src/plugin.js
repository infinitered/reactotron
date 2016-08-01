const createPlugin = store => {
  // hold onto the send
  let capturedSend

  // here's the plugin
  const plugin = config => {
    // remember the plugin
    capturedSend = config.send
    return {}
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
