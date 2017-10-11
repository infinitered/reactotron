export default (reactotron, action, ms, important = false) => {
  // let's call the type, name because that's "generic" name in Reactotron
  let { type: name } = action

  // convert from symbol to type if necessary
  if (typeof name === 'symbol') {
    name = name
      .toString()
      .replace(/^Symbol\(/, '')
      .replace(/\)$/, '')
  }

  // off ya go!
  reactotron.send('state.action.complete', { name, action, ms }, important)
}
