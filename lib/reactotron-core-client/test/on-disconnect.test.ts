import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"
import { createClosingServer } from "./create-closing-server"

const createSocket = (path) => new WebSocket(path)

let port: number
beforeEach(async () => {
  port = await getPort()
})

test("fires onConnect upon successful connection", (done) => {
  createClosingServer(port)
  const client = createClient({ createSocket, port, onDisconnect: done })

  client.connect()
})
