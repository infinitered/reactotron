/**
 * Provides helper functions for send state responses.
 */
export default config => {
  return {
    features: {
      stateActionComplete: (name, action) =>
        config.send('state.action.complete', { name, action }),

      stateValuesResponse: (path, value, valid = true) =>
        config.send('state.values.response', { path, value, valid }),

      stateKeysResponse: (path, keys, valid = true) =>
        config.send('state.keys.response', { path, keys, valid }),

      stateValuesChange: changes =>
        config.send('state.values.change', { changes })
    }
  }
}
