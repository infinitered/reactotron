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

test.cb('plugins support onDisconnect', t => {
  wss.on('connection', socket => socket.close())

  const plugin = () => send => ({
    onDisconnect: () => {
      t.pass()
      t.end()
    }
  })

  createClient({ createSocket, port }).use(plugin()).connect()
})
