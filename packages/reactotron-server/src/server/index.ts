import "reflect-metadata"
import * as argsParser from "yargs-parser"
import * as path from "path"
import * as express from "express"
import { createServer } from "http"

import { getConfig } from "./config"
import { pluginManager } from "./pluginManager"
import { createApolloServer } from "./apollo"
import { reactotron } from "./reactotron"

const argv = argsParser(process.argv.slice(2), {
  alias: {
    config: ["c"],
  },
})

const config = getConfig(argv.config)

pluginManager.loadPlugins()

async function bootUp() {
  reactotron.start(config.reactotronPort)
  const apolloServer = await createApolloServer()
  const app = express()
  const httpServer = createServer(app)

  apolloServer.applyMiddleware({ app })
  apolloServer.installSubscriptionHandlers(httpServer)

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"))
  })

  httpServer.listen({ port: config.webPort }, () => {
    console.log(
      `Server ready at http://localhost:${config.webPort}. Reactotron started on port ${
        config.reactotronPort
      }`,
    )
  })
}

bootUp()
