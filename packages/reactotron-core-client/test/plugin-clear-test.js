import test from 'ava'
import { createClient, CorePlugins } from '../src'
import socketClient from 'socket.io-client'
import plugin from '../src/plugins/clear'

test('clears', t => {
  const client = createClient({ io: socketClient })
  const results = []
  client.send = (type, payload) => {
    results.push({ type, payload })
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.clear, 'function')
  client.clear()
  t.is(results.length, 1)
  t.is(results[0].type, 'clear')
})
