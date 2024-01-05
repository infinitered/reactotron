import type { Plugin, Reactotron, ReactotronCore } from "reactotron-core-client"

import createCommandHander from "./commandHandler"
import createSendAction from "./sendAction"
import createEnhancer from "./enhancer"
import { DEFAULT_REPLACER_TYPE } from "./reducer"
import { PluginConfig } from "./pluginConfig"

function reactotronRedux<Client extends ReactotronCore = ReactotronCore>(
  pluginConfig: PluginConfig = {}
) {
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

  return (reactotron: Client) => {
    return {
      onCommand: createCommandHander(reactotron, mergedPluginConfig, onReduxStoreCreation),
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
    } satisfies Plugin<Reactotron>
  }
}

export type ReactotronReduxPlugin<Client extends ReactotronCore = ReactotronCore> = ReturnType<
  typeof reactotronRedux<Client>
>

export { reactotronRedux }
