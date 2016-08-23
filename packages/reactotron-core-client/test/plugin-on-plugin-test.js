import test from 'ava'
import { createClient } from '../src'
import getFreePort from './_get-free-port'
import socketClient from 'socket.io-client'
import socketServer from 'socket.io'

test.cb('plugins support onPlugin', t => {
  t.plan(3)
  const mockType = 'hello'
  const mockPayload = 'lol'

  getFreePort(port => {
    // create a client
    const client = createClient({ io: socketClient, port })

    // let's capture whatn onPlugin's instance scop ie
    let capturedInstance

    // make a plugin to capture onPlugin
    const plugin = () => send => ({
      onPlugin: (instance) => {
        t.is(instance, client)
        capturedInstance = instance
      }
    })

    // fire up a server
    socketServer(port)
      .on('connection', socket => {
        // send through the one we recieved in the plugin
        capturedInstance.send(mockType, mockPayload)

        // fires the server receives a command
        socket.on('command', ({type, payload}) => {
          if (type === 'client.intro') return
          t.is(type, mockType)
          t.deepEqual(payload, mockPayload)
          t.end()
        })
      })

    // add the plugin
    client.use(plugin())

    // kick it off
    client.connect()
  })
})
