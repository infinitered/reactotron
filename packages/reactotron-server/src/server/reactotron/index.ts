import Server, { createServer } from "reactotron-core-server"
import { ReactotronServer } from "reactotron-core-plugin"

import { addEventHandlers as addConnectionEventHandlers } from "./connectionHandler"
import { addEventHandlers as addCommandEventHandlers } from "./commandHandler"

class RServer implements ReactotronServer {
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

  stateValuesSubscribe(path) {
    this.server.stateValuesSubscribe(path)
  }
}

const reactotron = new RServer()

export { reactotron }
