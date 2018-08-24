import "reflect-metadata"
import * as path from "path"
import * as express from "express"
import { createServer } from "http"

import { createApolloServer } from "./apollo"
import { createReactotronServer } from "./reactotron"

async function bootUp() {
  createReactotronServer()
  const apolloServer = await createApolloServer()
  const app = express()
  const httpServer = createServer(app)

  apolloServer.applyMiddleware({ app })
  apolloServer.installSubscriptionHandlers(httpServer)

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"))
  })

  httpServer.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000`)
  })
}

bootUp()
