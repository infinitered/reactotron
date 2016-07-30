import test from 'ava'
import getFreePort from './_get-free-port'
import { createServer } from '../src'
import socketClient from './_socket-client'

test.cb('keeps track of the connected sockets', t => {
  getFreePort(port => {
    const server = createServer({ port }).start()

    // start empty
    t.is(server.openSockets.length, 0)

    // add 1
    const client1 = socketClient(`ws://localhost:${port}`)
    client1.on('connect', () => {
      t.is(server.openSockets.length, 1)
    })

    // add another
    const client2 = socketClient(`ws://localhost:${port}`)
    client2.on('connect', () => {
      t.is(server.openSockets.length, 2)
    })

    // stop
    server.stop()

    // make sure we're empty
    t.is(server.openSockets.length, 0)

    t.end()
  })
})
