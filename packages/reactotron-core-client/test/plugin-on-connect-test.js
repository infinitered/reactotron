import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'
import { createServer } from 'http'

let server
let wss // eslint-disable-line
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

test.cb('plugins support onConnect', t => {
  // this plugin supports onConnect
  const plugin = send => ({
    onConnect: () => {
      t.pass()
      t.end()
      server.close()
    }
  })

  // create a client & add the plugin
  createClient({ createSocket, port })
    .use(plugin)
    .connect()
})
