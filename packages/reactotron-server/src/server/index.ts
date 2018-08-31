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

  return { app, httpServer }
}

export const startServersListening = async ({ httpServer }, apolloServer = null, reactotronServer = null) => {
  
  // If we have been given a reactotron server instance, start listening
  if (reactotronServer) {
    reactotronServer.start(config.reactotronPort)
  }

  // @TODO Id expect some way to actually "start" apollo server listening in here, but new to this...

  // Start express server listening
  httpServer.listen({ port: config.webPort }, () => {
    console.log(`Server ready at http://localhost:${config.webPort}. Reactotron started on port ${config.reactotronPort}`)

    if (apolloServer) {
      console.log(`🚀 Subscriptions ready at ws://localhost:${config.webPort}${apolloServer.subscriptionsPath}`)
    }
  })
}

export const bootUp = async () => {
  const appServer = await httpServerInstance()
  const { app, httpServer } = appServer
  const apolloServer = await apolloServerInstance(app, httpServer)

  return startServersListening(appServer, apolloServer, reactotron);
}

// Only actually boot the server if we are not running tests
if (process.env.NODE_ENV !== 'test') {
  bootUp();
}
