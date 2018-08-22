import { ApolloServer } from "apollo-server-express"

import typeDefs from "./schema"
import resolvers from "./resolvers"

let apolloServer: ApolloServer

export function createApolloServer() {
  if (!apolloServer) {
    apolloServer = new ApolloServer({ typeDefs, resolvers })
  }

  return apolloServer
}
