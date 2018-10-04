import { CoreServer, Messenger } from "reactotron-core-plugin"

import * as MessageTypes from "../types"

import { StateSubscription } from "../apollo/schema"

class StateSubscriptions {
  subscriptions: StateSubscription[] = []

  addSubscription(path) {
    if (this.subscriptions.some(sub => sub.path === path)) return

    const newStateSubscription = { path }

    CoreServer.stateValuesSubscribe(path)
    this.subscriptions.push(newStateSubscription)

    Messenger.publish(MessageTypes.STATE_SUBSCRIPTION_ADDED, newStateSubscription)
  }

  all() {
    return this.subscriptions
  }
}

const StateSubscriptionsStore = new StateSubscriptions()

export { StateSubscriptionsStore }
