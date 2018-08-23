import { Resolver, Query, Subscription } from "type-graphql"

import { MessageTypes } from "../../messaging"
import { Connection } from "../../schema"
import { connections } from "../../datastore"

@Resolver()
export class ConnectionsResolver {
  @Query(() => [Connection])
  connections() {
    return connections.all()
  }

  @Subscription(() => [Connection], {
    topics: [MessageTypes.CONNECTION_ESTABLISHED, MessageTypes.CONNECTION_DISCONNECTED],
  })
  connectionsUpdated(): Connection[] {
    return connections.all()
  }
}
