import * as getPort from "get-port"
import { createServer } from "../src/reactotron-core-server"
import * as WebSocket from "ws"

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

test("keeps track of connections", (done) => {
  // when we get a command
  server.on("command", () => {
    expect(server.connections.length).toBe(1)
    server.send("hi", {})
    server.stop()
  })

  server.start()
  expect(server.connections.length).toBe(0)

  // setup the client
  const client = new WebSocket(`ws://localhost:${port}`)
  client.on("open", () => client.send(JSON.stringify(mock)))
  client.on("close", () => done())
  client.on("message", () => client.close())
})
