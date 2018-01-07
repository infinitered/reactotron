import { createClient } from '../src/reactotron-core-client'
import * as WebSocket from 'ws'
import * as getPort from 'get-port'
import { createClosingServer } from './create-closing-server'

const createSocket = path => new WebSocket(path)

test('plugins support onConnect', async done => {
  const port = await getPort()
  createClosingServer(port)

  // this plugin supports onDisconnect
  const plugin = reactotron => ({ onDisconnect: done })

  // create a client & add the plugin
  createClient({ createSocket, port })
    .use(plugin)
    .connect()
})
