import { ReactotronCore, createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"
import { PluginCreator } from "reactotron-core-client"

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

test("plugins support send", (done) => {
  let capturedSend: any

  // the plugin to extract the send function
  const plugin: PluginCreator<ReactotronCore> = (reactotron) => {
    capturedSend = reactotron.send
    return {}
  }

  // create the client, add the plugin, and connect
  const client = createClient({
    createSocket,
    port,
    onConnect: () => capturedSend(mock.type, mock.payload),
  }).use(plugin)

  // the server waits for the command
  server.on("connection", (socket) => {
    // fires the server receives a command
    socket.on("message", (message) => {
      const { type, payload } = JSON.parse(message.toString())
      if (type === "client.intro") return
      expect(type).toEqual(mock.type)
      expect(payload).toEqual(mock.payload)
      done()
    })
  })

  client.connect()
})
