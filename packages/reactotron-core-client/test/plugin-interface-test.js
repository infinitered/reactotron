import test from 'ava'
import { createClient } from '../src'
import io from './_fake-io'

test('client accepts plugins', t => {
  const client = createClient({ io })
  t.truthy(client.plugins)
  t.is(client.plugins.length, 0)
})

test('plugins are functions', t => {
  const client = createClient({ io })
  t.throws(() => client.addPlugin())
  t.throws(() => client.addPlugin(null))
  t.throws(() => client.addPlugin(''))
  t.throws(() => client.addPlugin(1))
})

test('plugins are invoke and return an object', t => {
  const client = createClient({ io })
  t.throws(() => client.addPlugin(() => null))
  t.throws(() => client.addPlugin(() => 1))
  t.throws(() => client.addPlugin(() => ''))
  t.throws(() => client.addPlugin(() => undefined))
  client.addPlugin(() => ({}))
  client.addPlugin(() => () => true)
})

test('plugins can literally do nothing', t => {
  const client = createClient({ io })
  const empty = config => ({})
  client.addPlugin(empty)
  t.is(client.plugins.length, 1)
})

test.cb('initialized with the config object', t => {
  const client = createClient({ io })
  client.addPlugin(config => {
    t.is(typeof config, 'object')
    t.is(config.ref, client)
    t.is(typeof config.send, 'function')
    t.end()
    return {}
  })
  t.is(client.plugins.length, 1)
})

test('can be added in createClient', t => {
  const createPlugin = (name, value) => config => ({ features: { [name]: () => value } })
  const client = createClient({
    io,
    plugins: [
      createPlugin('sayHello', 'hello'),
      createPlugin('sayGoodbye', 'goodbye')
    ]
  })

  t.is(client.sayHello(), 'hello')
  t.is(client.sayGoodbye(), 'goodbye')
})

test('plugins in createClient must be an array', t => {
  const client = createClient({ io, plugins: 5 })
  t.is(client.plugins.length, 0)
})
