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

test.cb('plugins support send', t => {
  const mockType = 'type'
  const mockPayload = 'payload'
  let capturedSend

  // the plugin to extract the send function
  const plugin = () => reactotron => {
    capturedSend = reactotron.send
    return {}
  }

  // create the client, add the plugin, and connect
  const client = createClient({
    createSocket,
    port,
    onConnect: () => {
      // send through the one we recieved in the plugin
      capturedSend(mockType, mockPayload)
    }
  }).use(plugin())

  // the server waits for the command
  wss.on('connection', ws => {
    // fires the server receives a command
    ws.on('message', message => {
      const { type, payload } = JSON.parse(message)
      if (type === 'client.intro') return
      t.deepEqual(payload, mockPayload)
      t.end()
      server.close()
    })
  })

  client.connect()
  // setTimeout(() => {
  // }, 50)
})
