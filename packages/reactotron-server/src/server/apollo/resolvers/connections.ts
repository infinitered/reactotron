import { Resolver, Query, Subscription } from "type-graphql"

import { MessageTypes } from "../../messaging"
import { Connection } from "../../schema"
import { connectionsStore } from "../../datastore"

@Resolver()
export class ConnectionsResolver {
  @Query(() => [Connection])
  connections() {
    return connectionsStore.all()
  }

  @Subscription(() => [Connection], {
    topics: [MessageTypes.CONNECTION_ESTABLISHED, MessageTypes.CONNECTION_DISCONNECTED],
  })
  connectionsUpdated(): Connection[] {
    return connectionsStore.all()
  }
}
