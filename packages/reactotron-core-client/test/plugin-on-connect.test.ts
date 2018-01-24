import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"

const createSocket = path => new WebSocket(path)

test("plugins support onConnect", async done => {
  const port = await getPort()
  const server = new WebSocket.Server({ port })

  // this plugin supports onConnect
  const plugin = send => ({
    onConnect: () => {
      done()
      server.close()
    },
  })

  // create a client & add the plugin
  createClient({ createSocket, port })
    .use(plugin)
    .connect()
})
