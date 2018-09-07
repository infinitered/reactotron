import * as express from "express"
import { createServer } from "http"
import "reflect-metadata"
import * as argsParser from "yargs-parser"
import { createApolloServer } from "./apollo"
import { getConfig, ReactotronServerConfig } from "./config"
import { pluginManager } from "./pluginManager"
import { reactotron } from "./reactotron"
import { resolve } from "path"
import * as Endpoints from "./endpoints"

const argv = argsParser(process.argv.slice(2), {
  alias: {
    config: ["c"],
  },
})

const config = getConfig(argv.config)

/**
 * Configures and runs everything. There's a lot going on here, but the jist is this:
 *
 * - start a reactotron WebSocket server (the mobile apps talk to this thing)
 * - start an http server using Express.JS
 * - mount a graphql server
 * - mount a react js app to host the reactotron ui
 *
 * @param config The configuration we'd like to use.
 */
export const bootUp = async (config: ReactotronServerConfig) => {
  // load the reactotron plugins
  pluginManager.loadPlugins()

  // fireup reactotron-core-server
  if (reactotron) {
    reactotron.start(config.reactotronPort)
  }

  // create an express app
  const app = express()

  // create an http server
  const httpServer = createServer(app)

  // configure static routing for things like images & css that the reactotron web app might need
  app.use(express.static(resolve(__dirname, "..", "..") + "/dist"))

  // attach some endpoints to power our web app
  const URL_PATH_TO_PLUGINS = "/reactotron-plugins.js"
  app.get("/", Endpoints.createReactotronAppEndpoint(URL_PATH_TO_PLUGINS))
  app.get(URL_PATH_TO_PLUGINS, Endpoints.createInjectPluginsEndpoint(pluginManager))

  // create & configure an Apollo GraphQL server
  const apolloServer = await createApolloServer()
  apolloServer.applyMiddleware({ app })
  apolloServer.installSubscriptionHandlers(httpServer)

  // Start express server listening
  httpServer.listen({ port: config.webPort }, () => {
    console.log(
      `Server ready at http://localhost:${config.webPort}. Reactotron started on port ${
        config.reactotronPort
      }`,
    )

    if (apolloServer) {
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${config.webPort}${
          apolloServer.subscriptionsPath
        }`,
      )
      console.log(`GraphQL ready at http://localhost:${config.webPort}/graphql`)
    }
  })
}

// Only actually boot the server if we are not running tests
if (process.env.NODE_ENV !== "test") {
  bootUp(config)
}
