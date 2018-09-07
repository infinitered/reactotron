import React from "react"
import ReactDOM from "react-dom"
import { SampleLoadOnly, SampleSubscribeOnly, SampleLoadAndSubscribe } from "./sample-apollo"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink, split } from "apollo-link"
import { ApolloProvider } from "react-apollo"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"

const SERVER = "localhost:4000"

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  }),
  new HttpLink({
    uri: `http://${SERVER}/graphql`,
    credentials: "same-origin",
  }),
])

const wsLink = new WebSocketLink({
  uri: `ws://${SERVER}/graphql`,
  options: {
    reconnect: true,
  },
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === "OperationDefinition" && def.operation === "subscription"
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

interface Props {}

class Main extends React.Component<Props> {
  render() {
    return (
      <ApolloProvider client={client}>
        <SampleLoadOnly />
        <SampleSubscribeOnly />
        <SampleLoadAndSubscribe />
      </ApolloProvider>
    )
  }
}

var mountNode = document.getElementById("root")
ReactDOM.render(<Main />, mountNode)
