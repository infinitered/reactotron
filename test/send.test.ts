import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"

const createSocket = path => new WebSocket(path)

const mock = {
  type: "GO!",
  payload: [1, 2, "three", { four: true }],
}

test("sends a valid command", async done => {
  const port = await getPort()
  const server = new WebSocket.Server({ port })

  // the server waits for the command
  server.on("connection", socket => {
    socket.on("message", message => {
      const { type, payload } = JSON.parse(message.toString())
      if (type === "client.intro") return
      expect(type).toBe(mock.type)
      expect(payload).toEqual(mock.payload)
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
