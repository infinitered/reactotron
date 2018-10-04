import { Resolver, Query, Mutation, Arg, Subscription, Root } from "type-graphql"

import { StateSubscription } from "./schema"
import * as MessageTypes from "../types"
import { StateSubscriptionsStore } from "../datastore/stateSubscriptionStore"

@Resolver()
export class StateSubscriptionsResolver {
  @Query(() => [StateSubscription])
  stateSubscriptions() {
    return StateSubscriptionsStore.all()
  }

  @Mutation()
  addStateSubscription(@Arg("path") path: string): boolean {
    StateSubscriptionsStore.addSubscription(path)

    return true
  }

  // TODO: Implement the needed methods and uncomment
  // @Mutation()
  // removeStateSubscription(@Arg("path") path: string): boolean {
  //   StateSubscriptionsStore.removeSubscription(path)

  //   return true
  // }

  // @Mutation()
  // clearStateSubscriptions(): boolean {
  //   StateSubscriptionsStore.clearSubscriptions()

  //   return true
  // }

  @Subscription(() => StateSubscription, {
    topics: [MessageTypes.STATE_SUBSCRIPTION_ADDED],
  })
  stateSubscriptionAdded(@Root() path: StateSubscription): StateSubscription {
    return path
  }
}
