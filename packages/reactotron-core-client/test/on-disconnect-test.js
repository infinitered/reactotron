import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'
import { createServer } from 'http'

let server
let wss
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

test.cb('fires onDisconnect upon successful connection', t => {
  // plan to see 1 assertion
  t.plan(1)

  // setup a server
  wss.on('connection', socket => {
    socket.close()
  })

  // setup the client
  const client = createClient({
    createSocket,
    port: port,
    onDisconnect: () => {
      t.pass()
      t.end()
    }
  })

  // kick it off
  client.connect()
})
