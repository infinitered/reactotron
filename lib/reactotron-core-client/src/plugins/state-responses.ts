import type {
  StateActionCompletePayload,
  StateBackupResponsePayload,
  StateKeysResponsePayload,
  StateValuesChangePayload,
  StateValuesResponsePayload,
} from "reactotron-core-contract"
import type { ReactotronCore, Plugin, InferFeatures } from "../reactotron-core-client"

/**
 * Provides helper functions for send state responses.
 */
const stateResponse = () => (reactotron: ReactotronCore) => {
  return {
    features: {
      stateActionComplete: (
        name: StateActionCompletePayload["name"],
        action: StateActionCompletePayload["action"],
        important = false
      ) => reactotron.send("state.action.complete", { name, action }, !!important),

      stateValuesResponse: (
        path: StateValuesResponsePayload["path"],
        value: StateValuesResponsePayload["value"],
        valid: StateValuesResponsePayload["value"] = true
      ) => reactotron.send("state.values.response", { path, value, valid }),

      stateKeysResponse: (
        path: StateKeysResponsePayload["path"],
        keys: StateKeysResponsePayload["keys"],
        valid: StateKeysResponsePayload["valid"] = true
      ) => reactotron.send("state.keys.response", { path, keys, valid }),

      stateValuesChange: (changes: StateValuesChangePayload["changes"]) =>
        changes.length > 0 && reactotron.send("state.values.change", { changes }),

      /** sends the state backup over to the server */
      stateBackupResponse: (state: StateBackupResponsePayload["state"]) =>
        reactotron.send("state.backup.response", { state }),
    },
  } satisfies Plugin<ReactotronCore>
}

export type StateResponsePlugin = ReturnType<typeof stateResponse>

export default stateResponse

export const hasStateResponsePlugin = (
  reactotron: ReactotronCore
): reactotron is ReactotronCore & InferFeatures<ReactotronCore, ReturnType<typeof stateResponse>> =>
  reactotron &&
  "stateActionComplete" in reactotron &&
  typeof reactotron.stateActionComplete === "function" &&
  "stateValuesResponse" in reactotron &&
  typeof reactotron.stateValuesResponse === "function" &&
  "stateKeysResponse" in reactotron &&
  typeof reactotron.stateKeysResponse === "function" &&
  "stateValuesChange" in reactotron &&
  typeof reactotron.stateValuesChange === "function" &&
  "stateBackupResponse" in reactotron &&
  typeof reactotron.stateBackupResponse === "function"

export const assertHasStateResponsePlugin = (
  reactotron: ReactotronCore
): asserts reactotron is ReactotronCore &
  InferFeatures<ReactotronCore, ReturnType<typeof stateResponse>> => {
  if (!hasStateResponsePlugin(reactotron)) {
    throw new Error(
      "This Reactotron client has not had the state responses plugin applied to it. Make sure that you add `use(stateResponse())` before adding this plugin."
    )
  }
}
