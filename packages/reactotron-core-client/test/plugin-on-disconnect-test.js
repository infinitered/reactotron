import test from 'ava'
import { createClient } from '../src'
import getFreePort from './_get-free-port'
import socketClient from 'socket.io-client'
import socketServer from 'socket.io'

test.cb('plugins support onDisconnect', t => {
  getFreePort(port => {
    socketServer(port).on('connection', socket => socket.disconnect())

    const plugin = () => send => ({
      onDisconnect: () => {
        t.pass()
        t.end()
      }
    })

    createClient({ io: socketClient, port })
      .use(plugin())
      .connect()
  })
})
