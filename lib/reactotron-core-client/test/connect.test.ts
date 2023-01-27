import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"
import { createClosingServer } from "./create-closing-server"

const createSocket = (path) => new WebSocket(path)

let port: number
beforeEach(async () => {
  port = await getPort()
})

test("starts unconnected", async () => {
  const client = createClient({ createSocket, port }) as any

  expect(client.connected).toBe(false)
})

test("connect returns itself", (done) => {
  createClosingServer(port, done)
  const client = createClient({ createSocket, port })
  const connectClient = client.connect()

  expect(connectClient).toBe(client)
})

test("set connected status when connecting", (done) => {
  createClosingServer(port, done)
  const client = createClient({ createSocket, port }) as any
  client.connect()

  expect(client.connected).toBe(true)
})

test("builds a socket", (done) => {
  createClosingServer(port, done)
  const client = createClient({ createSocket, port }) as any
  client.connect()

  expect(client.socket).toBeTruthy()
})
