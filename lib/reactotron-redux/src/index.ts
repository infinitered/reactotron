import type { Plugin, ReactotronCore } from "reactotron-core-client"

import createCommandHander from "./commandHandler"
import createSendAction from "./sendAction"
import createEnhancer from "./enhancer"
import { DEFAULT_REPLACER_TYPE } from "./reducer"
import { PluginConfig } from "./pluginConfig"

function reactotronRedux(pluginConfig: PluginConfig = {}) {
  const mergedPluginConfig: PluginConfig = {
    ...pluginConfig,
    restoreActionType: pluginConfig.restoreActionType || DEFAULT_REPLACER_TYPE,
  }

  const storeCreationHandlers: (() => void)[] = []
  const onReduxStoreCreation = (func: () => void) => {
    storeCreationHandlers.push(func)
  }
  const handleStoreCreation = () => {
    storeCreationHandlers.forEach((func) => {
      func()
    })
  }

  function plugin<Client extends ReactotronCore = ReactotronCore>(reactotron: Client) {
    return {
      name: "redux",
      // Fires when we receive a command from the Reactotron app.
      onCommand: createCommandHander(reactotron, mergedPluginConfig, onReduxStoreCreation),

      // All keys in this object will be attached to the main Reactotron instance
      // and available to be called directly.
      features: {
        createEnhancer: createEnhancer(reactotron, mergedPluginConfig, handleStoreCreation),
        setReduxStore: (store) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore shhhhhh -- this is a private API
          reactotron.reduxStore = store
          handleStoreCreation()
        },
        reportReduxAction: createSendAction(reactotron),
      },
    } satisfies Plugin<Client>
  }

  return plugin
}

export type ReactotronReduxPlugin = ReturnType<typeof reactotronRedux>

export { reactotronRedux }
