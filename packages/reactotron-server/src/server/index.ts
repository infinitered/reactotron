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

export const apolloServerInstance = async (app, httpServer) => {
  const apolloServer = await createApolloServer()
  apolloServer.applyMiddleware({ app })
  apolloServer.installSubscriptionHandlers(httpServer)

  return apolloServer
}

export const httpServerInstance = () => {
  const app = express()
  const httpServer = createServer(app)

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

  return { app, httpServer }
}

export const bootUp = async () => {
  reactotron.start(config.reactotronPort)

  const { app, httpServer } = await httpServerInstance()
  
  // Ignore compile issue as we will be using this later
  // @ts-ignore
  const apolloServer = await apolloServerInstance(app, httpServer)
}

// Only actually boot the server if we are not running tests
if (process.env.NODE_ENV !== 'test') {
  bootUp();
}
