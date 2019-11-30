import { Reactotron } from "../reactotron-core-client";

/**
 * Provides helper functions for send state responses.
 */
export default () => (reactotron: Reactotron) => {
  return {
    features: {
      stateActionComplete: (name, action, important = false) =>
        reactotron.send("state.action.complete", { name, action }, !!important),

      stateValuesResponse: (path, value, valid = true) =>
        reactotron.send("state.values.response", { path, value, valid }),

      stateKeysResponse: (path, keys, valid = true) =>
        reactotron.send("state.keys.response", { path, keys, valid }),

      stateValuesChange: changes =>
        (changes.length > 0) && reactotron.send("state.values.change", { changes }),

      // sends the state backup over to the server
      stateBackupResponse: state => reactotron.send("state.backup.response", { state }),
    },
  }
}
