/**
 * Provides helper functions for send state responses.
 */
export default () => reactotron => {
  return {
    features: {
      stateActionComplete: (name, action, important = false) =>
        reactotron.send('state.action.complete', { name, action }, !!important),

      stateValuesResponse: (path, value, valid = true) =>
        reactotron.send('state.values.response', { path, value, valid }),

      stateKeysResponse: (path, keys, valid = true) =>
        reactotron.send('state.keys.response', { path, keys, valid }),

      stateValuesChange: changes =>
        reactotron.send('state.values.change', { changes })
    }
  }
}
