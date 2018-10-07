import { CoreServer, Messenger } from "reactotron-core-plugin"
import { shallowEqualExplain } from "shallow-equal-explain"

import * as MessageTypes from "../types"

import { StateSubscription } from "../apollo/schema"

class StateSubscriptions {
  subscriptions: StateSubscription[] = []

  addSubscription(path) {
    if (this.subscriptions.some(sub => sub.path === path)) return

    const newStateSubscription = { path, value: undefined }

    CoreServer.stateValuesSubscribe(path)
    this.subscriptions.push(newStateSubscription)

    Messenger.publish(MessageTypes.STATE_SUBSCRIPTION_UPDATED, this.subscriptions)
  }

  removeSubscription(path) {
    this.subscriptions = this.subscriptions.filter(sub => sub.path !== path)

    CoreServer.stateValuesUnsubscribe(path)

    Messenger.publish(MessageTypes.STATE_SUBSCRIPTION_UPDATED, this.subscriptions)
  }

  clearSubscriptions() {
    this.subscriptions = []

    CoreServer.stateValuesClearSubscriptions()

    Messenger.publish(MessageTypes.STATE_SUBSCRIPTION_UPDATED, this.subscriptions)
  }

  updateSubscription(command) {
    for (const change of command.payload.changes) {
      const { path, value } = change
      let subscription = this.subscriptions.find(sub => sub.path === path)

      if (!subscription) return
      if (shallowEqualExplain(subscription.value, value).tag === 'PropertiesSame') return

      subscription.value = value

      Messenger.publish(MessageTypes.STATE_SUBSCRIPTION_UPDATED, this.subscriptions)
    }
  }

  all() {
    return this.subscriptions
  }
}

const StateSubscriptionsStore = new StateSubscriptions()

export { StateSubscriptionsStore }
