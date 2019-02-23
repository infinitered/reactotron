import reactotronReducer from "./reducer"
import createCustomDispatch from "./customDispatch"

export default function createEnhancer(
  reactotron: any,
  pluginConfig: PluginConfig,
  handleStoreCreation: () => void
) {
  return () => createStore => (reducer, ...args) => {
    const store = createStore(reactotronReducer(reducer, pluginConfig.restoreActionType), ...args)
    reactotron.reduxStore = store

    handleStoreCreation()

    return {
      ...store,
      dispatch: createCustomDispatch(reactotron, store, pluginConfig),
    }
  }
}
