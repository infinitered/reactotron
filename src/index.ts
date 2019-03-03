import { StoreEnhancer } from "redux"
import { Reactotron } from "reactotron-core-client"

import createCommandHander from "./commandHandler"
import createSendAction from "./sendAction"
import createEnhancer from "./enhancer"
import { DEFAULT_REPLACER_TYPE } from "./reducer"
import { PluginConfig } from "./pluginConfig"

function reactotronRedux(pluginConfig: PluginConfig = {}) {
  const mergedPluginConfig: PluginConfig = {
    restoreActionType: pluginConfig.restoreActionType || DEFAULT_REPLACER_TYPE,
    onBackup: pluginConfig.onBackup || null,
    onRestore: pluginConfig.onRestore || null,
  }

  const storeCreationHandlers = []
  const onReduxStoreCreation = (func: () => void) => {
    storeCreationHandlers.push(func)
  }
  const handleStoreCreation = () => {
    storeCreationHandlers.forEach(func => {
      func()
    })
  }

  return (reactotron: Reactotron) => {
    return {
      onCommand: createCommandHander(reactotron, mergedPluginConfig, onReduxStoreCreation),
      features: {
        createEnhancer: createEnhancer(reactotron, mergedPluginConfig, handleStoreCreation),
        reportReduxAction: createSendAction(reactotron),
      },
    }
  }
}

export { reactotronRedux }

declare module "reactotron-core-client" {
  // eslint-disable-next-line import/export
  export interface Reactotron {
    /**
     * Enhancer creator
     */
    createEnhancer: () => StoreEnhancer
  }
}
