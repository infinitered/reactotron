import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"

import { messaging } from "../messaging"
import { resolvers } from "./resolvers"

let apolloServer: ApolloServer

export async function createApolloServer() {
  if (!apolloServer) {
    const schema = await buildSchema({
      resolvers,
      pubSub: messaging,
    })

    apolloServer = new ApolloServer({
      schema,
    })
  }

  return apolloServer
}
