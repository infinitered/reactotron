import { createClient } from "../src/reactotron-core-client"
import WebSocket from "ws"
import getPort from "get-port"

const createSocket = (path) => new WebSocket(path)

const mock = {
  type: "GO!",
  payload: [1, 2, "three", { four: true }],
}

let port: number
let server: WebSocket.Server
beforeEach(async () => {
  port = await getPort()
  server = new WebSocket.Server({ port })
})

afterEach(() => {
  server?.close()
})

test("sends a valid command", (done) => {
  // the server waits for the command
  server.on("connection", (socket) => {
    socket.on("message", (message) => {
      const { type, payload } = JSON.parse(message.toString())
      if (type === "client.intro") return
      expect(type).toBe(mock.type)
      expect(payload).toEqual(mock.payload)
      socket.close()
      done()
    })
  })

  // client should send the command
  const client = createClient({
    createSocket,
    port,
    onConnect: () => client.send(mock.type, mock.payload),
  })
  client.connect()
})
