import {
  InferFeatures,
  Reactotron,
  StateResponsePlugin,
  assertHasStateResponsePlugin,
} from "reactotron-core-client"

import stateCleaner from "./helpers/stateCleaner"
import pathObject from "./helpers/pathObject"
import createSubscriptionsHandler from "./subscriptionsHandler"
import { PluginConfig } from "./pluginConfig"

export default function createCommandHandler(
  reactotron: Reactotron,
  pluginConfig: PluginConfig,
  onReduxStoreCreation: (func: () => void) => void
) {
  // make sure have loaded the StateResponsePlugin
  assertHasStateResponsePlugin(reactotron)
  const client = reactotron as Reactotron & InferFeatures<Reactotron, StateResponsePlugin>

  // create our subscriptions handler
  const subscriptionsHandler = createSubscriptionsHandler(reactotron, onReduxStoreCreation)

  return ({ type, payload }: { type: string; payload?: any }) => {
    const reduxStore = client.reduxStore

    switch (type) {
      // client is asking for keys
      case "state.keys.request":
      case "state.values.request":
        {
          const cleanedState = stateCleaner(reduxStore.getState())

          if (!payload.path) {
            client.stateKeysResponse(
              null,
              type === "state.keys.request" ? Object.keys(cleanedState) : cleanedState
            )
          } else {
            const filteredObj = pathObject(payload.path, cleanedState)

            const responseMethod =
              type === "state.keys.request" ? client.stateKeysResponse : client.stateValuesResponse

            responseMethod(
              payload.path,
              type === "state.keys.request"
                ? typeof filteredObj === "object"
                  ? Object.keys(filteredObj)
                  : undefined
                : filteredObj
            )
          }
        }
        break

      // client is asking to subscribe to some paths
      case "state.values.subscribe":
        subscriptionsHandler.setSubscriptions(payload.paths)
        subscriptionsHandler.sendSubscriptions()
        break

      // server is asking to dispatch this action
      case "state.action.dispatch":
        reduxStore.dispatch(payload.action)
        break

      // server is asking to backup state
      case "state.backup.request": {
        // run our state through our onBackup
        let backedUpState = reduxStore.getState()

        if (pluginConfig.onBackup) {
          backedUpState = pluginConfig.onBackup(backedUpState)
        }

        client.send("state.backup.response", { state: backedUpState })
        break
      }

      // server is asking to clobber state with this
      case "state.restore.request": {
        // run our state through our onRestore
        let restoredState = payload.state

        if (pluginConfig.onRestore) {
          restoredState = pluginConfig.onRestore(payload.state, reduxStore.getState())
        }

        client.reduxStore.dispatch({
          type: pluginConfig.restoreActionType,
          state: restoredState,
        })

        break
      }
    }
  }
}
