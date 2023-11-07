import { createClient } from "../src/reactotron-core-client"
import WebSocket from "ws"
import { getPort } from "get-port-please"
import { createClosingServer } from "./create-closing-server"

const createSocket = (path) => new WebSocket(path)

let port: number
beforeEach(async () => {
  port = await getPort({ random: true })
})

test("fires onConnect upon successful connection", (done) => {
  createClosingServer(port)
  const client = createClient({ createSocket, port, onConnect: done })

  client.connect()
})
