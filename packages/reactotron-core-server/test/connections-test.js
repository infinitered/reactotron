import test from 'ava'
import getFreePort from './_get-free-port'
import { createServer } from '../src'
import socketClient from './_socket-client'

test.cb('keeps track of connections', t => {
  getFreePort(port => {
    const server = createServer({
      port,
      onCommand: ({ type, payload }) => {
        t.is(server.connections.length, 1)
        t.end()
      }
    }).start()

    // start empty
    t.is(server.connections.length, 0)

    // add 1
    const client1 = socketClient(`ws://localhost:${port}`)
    client1.on('connect', () => {
      client1.emit('command', { type: 'client.intro', payload: {} })
    })
  })
})
