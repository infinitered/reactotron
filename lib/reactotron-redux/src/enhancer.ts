import type { ReactotronCore } from "reactotron-core-client"

import reactotronReducer from "./reducer"
import createCustomDispatch from "./customDispatch"
import { PluginConfig } from "./pluginConfig"

export default function createEnhancer<Client extends ReactotronCore = ReactotronCore>(
  reactotron: Client,
  pluginConfig: PluginConfig,
  handleStoreCreation: () => void
) {
  return (skipSettingStore = false) =>
    (createStore) =>
    (reducer, ...args) => {
      const originalStore = createStore(
        reactotronReducer(reducer, pluginConfig.restoreActionType),
        ...args
      )
      const store = {
        ...originalStore,
        dispatch: createCustomDispatch(reactotron, originalStore, pluginConfig),
      }

      if (!skipSettingStore) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore shhhhhh -- this is a private API
        reactotron.reduxStore = store
        handleStoreCreation()
      }

      return store
    }
}
