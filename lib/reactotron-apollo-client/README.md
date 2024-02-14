# reactotron-apollo-client

Log updates to your [@apollo/client](https://github.com/mrousavy/@apollo/client) store in the Reactotron timeline.

# Installing

```bash
npm i --save-dev reactotron-apollo-client
# or
yarn add -D reactotron-apollo-client
```

## Usage

Create your Apollo Client as you normally would, and then add the `reactotron-apollo-client` plugin::

```js
import { ApolloClient, InMemoryCache } from "@apollo/client"

const cache = new InMemoryCache()
export const client = new ApolloClient({
  uri: "https://api.graphql.guide/graphql",
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
})
```

To use the `apolloPlugin`, add the additional plugin on the `import` line.

```js
import Reactotron from "reactotron-react-native"
import apolloPlugin from "reactotron-apollo-client"
import { client } from "./apolloClient/location" // <--- update this location
...
Reactotron.configure()
  .use(apolloPlugin({ apolloClient: client })) // <--- here we go!
  .connect()
```

And you're done! Now you can see your Apollo caches, queries, and mutations in Reactotron.
