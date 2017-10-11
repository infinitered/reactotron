import { isEmpty, pipe, uniq, flatten } from 'ramda'
import requestKeys from './keys-request'
import requestValues from './values-request'
import getSubscriptionValues from './get-subscription-values'

export const RESTORE_ACTION_TYPE = 'REACTOTRON_RESTORE_STATE'
const DEFAULT_ON_BACKUP = state => state
const DEFAULT_ON_RESTORE = state => state

const createPlugin = (store, pluginConfig = {}) => {
  // the action type we'll trigger restores on
  const restoreActionType = pluginConfig.restoreActionType || RESTORE_ACTION_TYPE

  // a chance to change the state before backup
  const onBackup = pluginConfig.onBackup || DEFAULT_ON_BACKUP
  const onRestore = pluginConfig.onRestore || DEFAULT_ON_RESTORE

  // hold onto the send
  let capturedSend

  // which subscribed paths we're current listening to
  let subscriptions = []

  // here's the plugin
  const plugin = reactotron => {
    // remember the plugin's send function for use in the report() below.  :(
    capturedSend = reactotron.send

    const sendSubscriptions = () => {
      const changes = getSubscriptionValues(subscriptions, store.getState())
      reactotron.stateValuesChange(changes)
    }

    const sendSubscriptionsIfNeeded = () => {
      const changes = getSubscriptionValues(subscriptions, store.getState())
      if (!isEmpty(changes)) {
        sendSubscriptions()
      }
    }

    store.subscribe(sendSubscriptionsIfNeeded)

    return {
      // fires
      onCommand: ({ type, payload }) => {
        switch (type) {
          // client is asking for keys
          case 'state.keys.request':
            return requestKeys(store.getState(), reactotron, payload.path)

          // client is asking for values
          case 'state.values.request':
            return requestValues(store.getState(), reactotron, payload.path)

          // client is asking to subscribe to some paths
          case 'state.values.subscribe':
            subscriptions = pipe(flatten, uniq)(payload.paths)
            sendSubscriptions()
            return

          // server is asking to dispatch this action
          case 'state.action.dispatch':
            store.dispatch(payload.action)
            return

          // server is asking to backup state
          case 'state.backup.request': {
            // run our state through our onBackup
            const state = onBackup(store.getState())
            reactotron.send('state.backup.response', { state })
            return
          }

          // server is asking to clobber state with this
          case 'state.restore.request': {
            // run our state through our onRestore
            const state = onRestore(payload.state)
            store.dispatch({ type: restoreActionType, state })
          }
        }
      }
    }
  }

  // attach a function that we can call from the enhancer
  plugin.report = (action, ms, important = false) => {
    if (!capturedSend) return

    // let's call the type, name because that's "generic" name in Reactotron
    let { type: name } = action

    // convert from symbol to type if necessary
    if (typeof name === 'symbol') {
      name = name
        .toString()
        .replace(/^Symbol\(/, '')
        .replace(/\)$/, '')
    }

    // off ya go!
    capturedSend('state.action.complete', { name, action, ms }, important)
  }

  return plugin
}

export default createPlugin
