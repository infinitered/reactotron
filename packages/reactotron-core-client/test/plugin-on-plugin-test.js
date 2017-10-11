import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test.cb('plugins support onPlugin', t => {
  t.plan(2)

  // create a client
  const client = createClient({ createSocket })

  // make a plugin to capture onPlugin
  const plugin = () => send => ({
    onPlugin: instance => {
      t.is(instance, client)
      t.pass()
      t.end()
    }
  })

  // add the plugin
  client.use(plugin())
})
