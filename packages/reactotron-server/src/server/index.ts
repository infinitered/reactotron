import * as express from "express"
import { createServer } from "http"

import { createApolloServer } from "./apollo"
import { createReactotronServer } from "./reactotron"

createReactotronServer()
const apolloServer = createApolloServer()
const app = express()
const httpServer = createServer(app)

apolloServer.applyMiddleware({ app })
apolloServer.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000`)
})
