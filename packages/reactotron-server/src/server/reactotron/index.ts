import Server, { createServer } from "reactotron-core-server"

import { addEventHandlers as addConnectionEventHandlers } from './connectionHandler'
import { addEventHandlers as addCommandEventHandlers } from './commandHandler'

let reactotronServer: Server

export function createReactotronServer(port = 9090) {
  if (!reactotronServer) {
    reactotronServer = createServer({ port })

    addConnectionEventHandlers(reactotronServer)
    addCommandEventHandlers(reactotronServer)

    reactotronServer.start()
  }

  return reactotronServer
}
