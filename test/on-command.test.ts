import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"

const createSocket = path => new WebSocket(path)

const mock = {
  type: "TEST",
  payload: [1, 2, "three", { four: true }],
}

test("the default onCommand does nothing", () => {
  const client = createClient({ createSocket })
  expect(client.options.onCommand({})).toBeFalsy()
})

test("receives a valid command", async done => {
  const port = await getPort()
  const server = new WebSocket.Server({ port })

  // client should receive the command
  const client = createClient({
    createSocket,
    port: port,
    onCommand: ({ type, payload }) => {
      expect(type).toBe(mock.type)
      expect(payload).toEqual(mock.payload)
      server.close()
      done()
    },
  })

  // when the server gets a connection, send the command
  server.on("connection", socket => socket.send(JSON.stringify(mock)))
  client.connect()
})
