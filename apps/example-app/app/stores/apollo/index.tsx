import { ApolloClient, InMemoryCache } from "@apollo/client"

const cache = new InMemoryCache()

export const client = new ApolloClient({
  uri: "https://api.graphql.guide/graphql",
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
})
