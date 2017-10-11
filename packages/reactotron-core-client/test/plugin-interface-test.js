import test from 'ava'
import { createClient, CorePlugins } from '../src'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('client accepts plugins', t => {
  const client = createClient({ createSocket })
  t.truthy(client.plugins)
  t.is(client.plugins.length, CorePlugins.length)
})

test('plugins are functions', t => {
  const client = createClient({ createSocket })
  t.throws(() => client.use())
  t.throws(() => client.use(null))
  t.throws(() => client.use(''))
  t.throws(() => client.use(1))
})

test('plugins are invoke and return an object', t => {
  const client = createClient({ createSocket })
  t.throws(() => client.use(() => null))
  t.throws(() => client.use(() => 1))
  t.throws(() => client.use(() => ''))
  t.throws(() => client.use(() => undefined))
  client.use(() => ({}))
  client.use(() => () => true)
})

test('plugins can literally do nothing', t => {
  const client = createClient({ createSocket })
  const empty = reactotron => ({})
  client.use(empty)
  t.is(client.plugins.length, CorePlugins.length + 1)
})

test.cb('initialized with the config object', t => {
  const client = createClient({ createSocket })
  client.use(reactotron => {
    t.is(typeof reactotron, 'object')
    t.is(reactotron, client)
    t.is(typeof reactotron.send, 'function')
    t.end()
    return {}
  })
  t.is(client.plugins.length, CorePlugins.length + 1)
})

test('can be added in createClient', t => {
  const createPlugin = (name, value) => reactotron => ({ features: { [name]: () => value } })
  const client = createClient({
    createSocket,
    plugins: [createPlugin('sayHello', 'hello'), createPlugin('sayGoodbye', 'goodbye')]
  })

  t.is(client.sayHello(), 'hello')
  t.is(client.sayGoodbye(), 'goodbye')
})

test('plugins in createClient must be an array', t => {
  const client = createClient({ createSocket, plugins: 5 })
  t.is(client.plugins.length, 0)
})
