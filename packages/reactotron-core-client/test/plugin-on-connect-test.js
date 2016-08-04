import test from 'ava'
import { createClient } from '../src'
import getFreePort from './_get-free-port'
import socketClient from 'socket.io-client'
import socketServer from 'socket.io'

test.cb('plugins support onConnect', t => {
  // this plugin supports onConnect
  const plugin = send => ({
    onConnect: () => {
      t.pass()
      t.end()
    }
  })

  getFreePort(port => {
    // fire up a server
    socketServer(port)

    // create a client & add the plugin
    createClient({ io: socketClient, port })
      .use(plugin)
      .connect()
  })
})
