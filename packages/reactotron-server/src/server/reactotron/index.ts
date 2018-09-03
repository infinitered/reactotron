import Server, { createServer } from "reactotron-core-server"

import { addEventHandlers as addConnectionEventHandlers } from "./connectionHandler"
import { addEventHandlers as addCommandEventHandlers } from "./commandHandler"

class ReactotronServer {
  server: Server

  start(port = 9090) {
    this.server = createServer({ port })

    addConnectionEventHandlers(this.server)
    addCommandEventHandlers(this.server)

    this.server.start()
  }

  send(type, payload) {
    this.server.send(type, payload)
  }
}

const reactotron = new ReactotronServer()

export { reactotron }
