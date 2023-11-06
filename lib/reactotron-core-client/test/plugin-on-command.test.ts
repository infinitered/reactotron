import { createClient } from "../src/reactotron-core-client"
import WebSocket from "ws"
import getPort from "get-port"

const createSocket = (path) => new WebSocket(path)
const mock = { type: "type", payload: "payload" }

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

test("plugins support command", (done) => {
  // the plugin to capture the command
  const plugin = () => ({
    onCommand: (command) => {
      expect(command.type).toBe(mock.type)
      expect(command.payload).toEqual(mock.payload)
      done()
    },
  })

  // the server waits for the command
  server.on("connection", (socket) => socket.send(JSON.stringify(mock)))

  // create the client, add the plugin, and connect
  const client: any = createClient({ createSocket, port })
  client.use(plugin)
  client.connect()
})
