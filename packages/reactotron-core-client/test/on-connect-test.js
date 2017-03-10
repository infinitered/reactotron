import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'
import { createServer } from 'http'

let server
let wss // eslint-disable-line
let port
test.cb.beforeEach(t => {
  server = createServer()
  wss = new WebSocket.Server({ server })
  server.listen(() => {
    port = server.address().port
    t.end()
  })
})
const createSocket = path => new WebSocket(path)

test.cb('fires onConnect upon successful connection', t => {
  // plan to see 1 assertion
  t.plan(1)

  // setup the client
  const client = createClient({
    createSocket,
    port: port,
    onConnect: () => {
      t.pass()
      t.end()
    }
  })

  // kick it off
  client.connect()
})
