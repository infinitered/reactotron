import React from "react"
import ReactDOM from "react-dom"
import { SampleApollo } from "./sample-apollo"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"
import { ApolloProvider } from "react-apollo"

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
    }),
    new HttpLink({
      uri: "http://localhost:4000/graphql",
      credentials: "same-origin",
    }),
  ]),
  cache: new InMemoryCache(),
})

interface Props {}

class Main extends React.Component<Props> {
  render() {
    return (
      <ApolloProvider client={client}>
        <SampleApollo />
      </ApolloProvider>
    )
  }
}

var mountNode = document.getElementById("root")
ReactDOM.render(<Main />, mountNode)
