import test from 'ava'
import { createClient } from '../src'
import getFreePort from './_get-free-port'
import socketClient from 'socket.io-client'
import socketServer from 'socket.io'

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

  getFreePort(port => {
    // the server waits for the command
    socketServer(port).on('connection', socket => {
      socket.emit('command', { type: mockType, payload: mockPayload })
    })

    // create the client, add the plugin, and connect
    const client = createClient({ io: socketClient, port: port })
    client.use(plugin())
    client.connect()
  })
})
