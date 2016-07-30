import test from 'ava'
import { createClient } from '../src'
import socketServer from 'socket.io'
import socketClient from 'socket.io-client'
import getFreePort from './_get-free-port'

test.cb('fires onConnect upon successful connection', t => {
  getFreePort(port => {
    // plan to see 1 assertion
    t.plan(1)

    // setup a server
    socketServer(port)

    // setup the client
    const client = createClient({
      io: socketClient,
      port: port,
      onConnect: () => {
        t.pass(true)
        t.end()
      }
    })

    // kick it off
    client.connect()
  })
})
