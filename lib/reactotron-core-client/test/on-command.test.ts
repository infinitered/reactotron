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

const mock = {
  type: "TEST",
  payload: [1, 2, "three", { four: true }],
}

test("the default onCommand does nothing", () => {
  const client = createClient({ createSocket })
  expect(client.options.onCommand?.({})).toBeFalsy()
  client.close()
})

test("receives a valid command", (done) => {
  // client should receive the command
  const client = createClient({
    createSocket,
    port: port,
    onCommand: ({ type, payload }) => {
      expect(type).toBe(mock.type)
      expect(payload).toEqual(mock.payload)
      done()
    },
  })

  // when the server gets a connection, send the command
  server.on("connection", (socket) => socket.send(JSON.stringify(mock)))
  client.connect()
})
