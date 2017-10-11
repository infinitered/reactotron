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

test.cb('plugins support command', t => {
  const mockType = 'type'
  const mockPayload = 'payload'

  // the plugin to capture the command
  const plugin = () => config => {
    return {
      onCommand: command => {
        t.is(command.type, mockType)
        t.deepEqual(command.payload, mockPayload)
        t.end()
      }
    }
  }

  // the server waits for the command
  wss.on('connection', socket => {
    socket.send(JSON.stringify({ type: mockType, payload: mockPayload }))
  })

  // create the client, add the plugin, and connect
  const client = createClient({ createSocket, port })
  client.use(plugin())
  client.connect()
})
