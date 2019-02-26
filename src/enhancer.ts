import reactotronReducer from "./reducer"
import createCustomDispatch from "./customDispatch"

export default function createEnhancer(
  reactotron: any,
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
