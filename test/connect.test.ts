import { createClient } from "../src/reactotron-core-client"
import * as WebSocket from "ws"
import * as getPort from "get-port"
import { createClosingServer } from "./create-closing-server"

const createSocket = path => new WebSocket(path)

test("starts unconnected", async () => {
  const port = await getPort()
  const client = createClient({ createSocket, port })

  expect(client.connected).toBe(false)
})

test("connect returns itself", async done => {
  const port = await getPort()
  createClosingServer(port, done)
  const client = createClient({ createSocket, port })
  const connectClient = client.connect()

  expect(connectClient).toBe(client)
})

test("set connected status when connecting", async done => {
  const port = await getPort()
  createClosingServer(port, done)
  const client = createClient({ createSocket, port })
  client.connect()

  expect(client.connected).toBe(true)
})

test("builds a socket", async done => {
  const port = await getPort()
  createClosingServer(port, done)
  const client = createClient({ createSocket, port })
  client.connect()

  expect(client.socket).toBeTruthy()
})
