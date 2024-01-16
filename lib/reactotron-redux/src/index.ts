import type { StoreEnhancer } from "redux"
import { Plugin, Reactotron } from "reactotron-core-client"

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

  const storeCreationHandlers = []
  const onReduxStoreCreation = (func: () => void) => {
    storeCreationHandlers.push(func)
  }
  const handleStoreCreation = () => {
    storeCreationHandlers.forEach((func) => {
      func()
    })
  }

  function plugin<Client extends Reactotron = Reactotron>(reactotron: Client) {
    return {
      // Fires when we receive a command from the Reactotron app.
      onCommand: createCommandHander(reactotron, mergedPluginConfig, onReduxStoreCreation),

      // All keys in this object will be attached to the main Reactotron instance
      // and available to be called directly.
      features: {
        createEnhancer: createEnhancer(reactotron, mergedPluginConfig, handleStoreCreation),
        setReduxStore: (store) => {
          reactotron.reduxStore = store
          handleStoreCreation()
        },
        reportReduxAction: createSendAction(reactotron),
      },
    } satisfies Plugin<Client>
  }

  return plugin
}

export { reactotronRedux }

declare module "reactotron-core-client" {
  // eslint-disable-next-line import/export
  export interface Reactotron {
    reduxStore?: any

    /**
     * Enhancer creator
     */
    createEnhancer?: (skipSettingStore?: boolean) => StoreEnhancer

    /**
     * Store setter
     */
    setReduxStore?: (store: any) => void
  }
}
