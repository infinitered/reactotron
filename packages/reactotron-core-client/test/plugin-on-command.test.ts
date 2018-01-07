import { createClient } from '../src/reactotron-core-client'
import * as WebSocket from 'ws'
import * as getPort from 'get-port'

const createSocket = path => new WebSocket(path)
const mock = { type: 'type', payload: 'payload' }

test('plugins support command', async done => {
  const port = await getPort()
  const server = new WebSocket.Server({ port })

  // the plugin to capture the command
  const plugin = reactotron => ({
    onCommand: command => {
      expect(command.type).toBe(mock.type)
      expect(command.payload).toEqual(mock.payload)
      done()
    },
  })

  // the server waits for the command
  server.on('connection', socket => socket.send(JSON.stringify(mock)))

  // create the client, add the plugin, and connect
  const client: any = createClient({ createSocket, port })
  client.use(plugin)
  client.connect()
})
