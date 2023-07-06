import type { ReactotronCore, Plugin, InferFeatures } from "../reactotron-core-client"

type Action = Record<string, any>
type State = Record<string, any>

/**
 * Provides helper functions for send state responses.
 */
const stateResponse = () => (reactotron: ReactotronCore) => {
  return {
    features: {
      stateActionComplete: (name: string, action: Action, important = false) =>
        reactotron.send("state.action.complete", { name, action }, !!important),

      stateValuesResponse: (path: string, value, valid = true) =>
        reactotron.send("state.values.response", { path, value, valid }),

      stateKeysResponse: (path: string, keys: string[], valid = true) =>
        reactotron.send("state.keys.response", { path, keys, valid }),

      stateValuesChange: (changes: Action[]) =>
        changes.length > 0 && reactotron.send("state.values.change", { changes }),

      /** sends the state backup over to the server */
      stateBackupResponse: (state: State) => reactotron.send("state.backup.response", { state }),
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
