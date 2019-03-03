import { Reactotron } from "reactotron-core-client";

import reactotronReducer from "./reducer"
import createCustomDispatch from "./customDispatch"
import { PluginConfig } from "./pluginConfig"

export default function createEnhancer(
  reactotron: Reactotron,
  pluginConfig: PluginConfig,
  handleStoreCreation: () => void
) {
  return () => createStore => (reducer, ...args) => {
    const originalStore = createStore(
      reactotronReducer(reducer, pluginConfig.restoreActionType),
      ...args
    )
    const store = {
      ...originalStore,
      dispatch: createCustomDispatch(reactotron, originalStore, pluginConfig),
    }
    reactotron.reduxStore = store

    handleStoreCreation()

    return store
  }
}
