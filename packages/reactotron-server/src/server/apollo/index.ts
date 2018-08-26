import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"

import { pluginManager } from "../pluginManager"
import { messaging } from "../messaging"
import { resolvers } from "./resolvers"

export async function createApolloServer() {
  const schema = await buildSchema({
    resolvers: [...resolvers, ...pluginManager.resolvers],
    pubSub: messaging,
  })

  const apolloServer = new ApolloServer({
    schema,
  })

  return apolloServer
}
