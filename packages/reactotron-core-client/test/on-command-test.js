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

const mockType = 'TEST'
const mockPayload = [1, 2, 'three', { four: true }]

test('the default onCommand does nothing', t => {
  const client = createClient({ createSocket })
  t.falsy(client.options.onCommand())
})

test.cb('receives a valid command', t => {
  // client should receive the command
  const client = createClient({
    createSocket,
    port: port,
    onCommand: ({ type, payload }) => {
      t.is(type, mockType)
      t.deepEqual(payload, mockPayload)
      t.end()
    },
  })

  // when the server gets a connection, send the command
  wss.on('connection', socket => {
    socket.send(JSON.stringify({ type: mockType, payload: mockPayload }))
    server.close()
  })

  // kick it off
  client.connect()
})
