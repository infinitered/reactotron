import test from 'ava'
import { createClient } from '../src'
import getFreePort from './_get-free-port'
import socketClient from 'socket.io-client'
import socketServer from 'socket.io'

test.cb('plugins support send', t => {
  const mockType = 'type'
  const mockPayload = 'payload'

  // odd way to hold on to the plugin's send function
  let capturedSend

  // the plugin to extract the send function
  const plugin = () => reactotron => {
    capturedSend = reactotron.send
    return {}
  }

  getFreePort(port => {
    // the server waits for the command
    socketServer(port).on('connection', socket => {
      // send through the one we recieved in the plugin
      capturedSend(mockType, mockPayload)

      // fires the server receives a command
      socket.on('command', ({ type, payload }) => {
        if (type === 'client.intro') return
        t.is(type, mockType)
        t.deepEqual(payload, mockPayload)
        t.end()
      })
    })

    // create the client, add the plugin, and connect
    createClient({ io: socketClient, port: port })
      .use(plugin())
      .connect()
  })
})
