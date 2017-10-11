import test from 'ava'
import { createClient, CorePlugins } from '../src'
import socketClient from 'socket.io-client'
import plugin from '../src/plugins/logger'

test('the 4 functions send the right data', t => {
  const client = createClient({ io: socketClient })
  const results = []
  client.send = (type, payload) => {
    results.push({ type, payload })
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.log, 'function')
  t.is(typeof client.debug, 'function')
  t.is(typeof client.warn, 'function')
  t.is(typeof client.error, 'function')
  client.log('a')
  client.debug('b')
  client.warn('c')
  client.error('d')
  t.is(results.length, 4)
  t.is(results[0].type, 'log')
  t.is(results[1].type, 'log')
  t.is(results[2].type, 'log')
  t.is(results[3].type, 'log')
  t.is(results[0].payload.level, 'debug')
  t.is(results[1].payload.level, 'debug')
  t.is(results[2].payload.level, 'warn')
  t.is(results[3].payload.level, 'error')
  t.is(results[0].payload.message, 'a')
  t.is(results[1].payload.message, 'b')
  t.is(results[2].payload.message, 'c')
  t.is(results[3].payload.message, 'd')
})
