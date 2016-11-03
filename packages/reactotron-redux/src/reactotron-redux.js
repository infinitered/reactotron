// This is the new plugin I'll be promoting to the default export when we hit 2.x
import createActionTracker from './create-action-tracker'
import reportAction from './report-action'
import createReplacementReducer, { DEFAULT_REPLACER_TYPE } from './replacement-reducer'
import createStore from './create-store'
import requestKeys from './keys-request'
import requestValues from './values-request'
import getSubscriptionValues from './get-subscription-values'
import { identity, isEmpty, pipe, uniq, flatten } from 'ramda'

export default (pluginConfig = {}) => reactotron => {
  // the one & only redux store --- TODO: find a better way to do this
  let reduxStore = null

  // which subscribed paths we're current listening to
  let subscriptions = []

  const sendSubscriptions = () => {
    const changes = getSubscriptionValues(subscriptions, reduxStore.getState())
    reactotron.stateValuesChange(changes)
  }

  const sendSubscriptionsIfNeeded = () => {
    const changes = getSubscriptionValues(subscriptions, reduxStore.getState())
    if (!isEmpty(changes)) {
      sendSubscriptions()
    }
  }

  // a chance to change the state before backup
  const restoreActionType = pluginConfig.restoreActionType || DEFAULT_REPLACER_TYPE
  const onBackup = pluginConfig.onBackup || identity
  const onRestore = pluginConfig.onRestore || identity

  return {
    // fires when we receive a command from Reactotron
    onCommand: ({ type, payload }) => {
      switch (type) {
        // client is asking for keys
        case 'state.keys.request':
          return requestKeys(reduxStore.getState(), reactotron, payload.path)

        // client is asking for values
        case 'state.values.request':
          return requestValues(reduxStore.getState(), reactotron, payload.path)

        // client is asking to subscribe to some paths
        case 'state.values.subscribe':
          subscriptions = pipe(flatten, uniq)(payload.paths)
          sendSubscriptions()
          return

        // server is asking to dispatch this action
        case 'state.action.dispatch':
          reduxStore.dispatch(payload.action)
          return

        // server is asking to backup state
        case 'state.backup.request': {
          // run our state through our onBackup
          const state = onBackup(reduxStore.getState())
          reactotron.send('state.backup.response', { state })
          return
        }

        // server is asking to clobber state with this
        case 'state.restore.request': {
          // run our state through our onRestore
          const state = onRestore(payload.state)
          reduxStore.dispatch({ type: restoreActionType, state })
          return
        }

      }
    },

    // bestow these features on the Reactotron namespace
    features: {
      // a store enhancer which tracks actions for reporting
      createActionTracker: createActionTracker.bind(this, reactotron, pluginConfig),

      // sends messages thru reactotron about the action
      reportReduxAction: reportAction.bind(this, reactotron),

      // creates a replacement reducer for uploading new state
      createReplacementReducer,

      // wraps redux's createStore for sane configuration
      createStore: createStore.bind(this, reactotron),

      // sets the current redux store
      setReduxStore: store => {
        // remember
        reduxStore = store

        // subscribe
        store.subscribe(sendSubscriptionsIfNeeded)
      }
    }
  }
}
