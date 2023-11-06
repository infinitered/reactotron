import getPort from "get-port"
import { createServer } from "../src/reactotron-core-server"
import WebSocket from "ws"

const mock = { type: "client.intro", payload: {} }
let port: number
let server: ReturnType<typeof createServer>

beforeEach(async () => {
  port = await getPort()
  server = createServer({ port })
})

afterEach(() => {
  server.stop()
})

test("sends a valid command", (done) => {
  server.on("command", () => server.send(mock.type, mock.payload))
  server.start()

  // setup the client
  const client = new WebSocket(`ws://localhost:${port}`)

  // when the client receives a command from the server
  client.on("message", (message) => {
    const { type, payload } = JSON.parse(message.toString())
    if (type === mock.type) {
      server.stop()
      expect(type).toBe(mock.type)
      expect(payload).toEqual(mock.payload)
      client.close()
      done()
    }
  })

  client.on("open", () => client.send(JSON.stringify(mock)))
})
