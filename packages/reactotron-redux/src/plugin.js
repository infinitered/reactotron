import R from 'ramda'
import RS from 'ramdasauce'
import requestKeys from './keys-request'
import requestValues from './values-request'
import subscribeToValues from './values-subscribe'
import getSubscriptionValues from './get-subscription-values'

const createPlugin = store => {
  // hold onto the send
  let capturedSend

  // which subscribed paths we're current listening to
  let subscriptions = []

  // here's the plugin
  const plugin = reactotron => {
    // remember the plugin's send function for use in the report() below.  :(
    capturedSend = reactotron.send

    //
    const sendSubscriptionsIfNeeded = () => {
      const changes = getSubscriptionValues(subscriptions, store.getState())
      if (!R.isEmpty(changes)) {
        reactotron.stateValuesChange(changes)
      }
    }

    store.subscribe(sendSubscriptionsIfNeeded)

    return {
      // fires
      onCommand: ({type, payload}) => {
        switch (type) {
          // client is asking for keys
          case 'state.keys.request':
            return requestKeys(store.getState(), reactotron, payload.path)

          // client is asking for values
          case 'state.values.request':
            return requestValues(store.getState(), reactotron, payload.path)

          // client is asking to subscribe to some paths
          case 'state.values.subscribe':
            subscriptions = R.pipe(R.flatten, R.uniq)(payload.paths)
            sendSubscriptionsIfNeeded()
            return
        }
      }
    }
  }

  // attach a function that we can call from the enhancer
  plugin.report = (action, ms) => {
    if (!capturedSend) return

    // let's call the type, name because that's "generic" name in Reactotron
    let { type: name } = action

    // convert from symbol to type if necessary
    if (typeof name === 'symbol') {
      name = name.toString().replace(/^Symbol\(/, '').replace(/\)$/, '')
    }

    // off ya go!
    capturedSend('state.action.complete', { name, action, ms })
  }

  return plugin
}

export default createPlugin
