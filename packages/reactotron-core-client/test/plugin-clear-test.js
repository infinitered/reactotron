import test from 'ava'
import { createClient, CorePlugins } from '../src'
import plugin from '../src/plugins/clear'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('clears', t => {
  const client = createClient({ createSocket })
  const results = []
  client.send = (type, payload) => { results.push({type, payload}) }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.clear, 'function')
  client.clear()
  t.is(results.length, 1)
  t.is(results[0].type, 'clear')
})
