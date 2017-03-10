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

const mockType = 'GO!'
const mockPayload = [1, 2, 'three', { four: true }]

test.cb('sends a valid command', t => {
  // the server waits for the command
  wss.on('connection', ws => {
    ws.on('message', message => {
      const { type, payload } = JSON.parse(message)
      if (type === 'client.intro') return
      t.is(type, mockType)
      t.deepEqual(payload, mockPayload)
      t.end()
    })
  })

  // client should send the command
  const client = createClient({
    createSocket,
    port,
    onConnect: () => {
      client.send(mockType, mockPayload)
    }
  })
  client.connect()
})
