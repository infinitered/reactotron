import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"
import { createClosingServer } from "./create-closing-server"

const createSocket = path => new WebSocket(path)

test("fires onConnect upon successful connection", async done => {
  const port = await getPort()
  createClosingServer(port)
  const client = createClient({ createSocket, port, onConnect: done })

  client.connect()
})
