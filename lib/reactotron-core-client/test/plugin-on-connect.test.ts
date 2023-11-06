import { createClient } from "../src/reactotron-core-client"
import WebSocket from "ws"
import getPort from "get-port"

const createSocket = (path) => new WebSocket(path)

let port: number
let server: WebSocket.Server
beforeEach(async () => {
  port = await getPort()
  server = new WebSocket.Server({ port })
})

afterEach(() => {
  server.clients.forEach((client) => client.close())
  server?.close()
})

test("plugins support onConnect", (done) => {
  // this plugin supports onConnect
  const plugin = () => ({
    onConnect: () => {
      done()
    },
  })

  // create a client & add the plugin
  createClient({ createSocket, port }).use(plugin).connect()
})
