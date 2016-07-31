import test from 'ava'
import { createClient } from '../src'
import io from './_fake-io'
import R from 'ramda'

test('features must be an object if they appear', t => {
  const client = createClient({ io })
  t.throws(() => client.addPlugin(send => ({ features: 1 })))
})

test('some names are not allowed', t => {
  const client = createClient({ io })
  const createPlugin = features => send => ({features})

  const badPlugins = R.map(
    name => createPlugin({ [name]: R.identity }),
    ['options', 'connected', 'socket', 'plugins', 'configure', 'connect', 'send', 'addPlugin']
  )

  R.forEach(plugin => {
    t.throws(() => { client.addPlugin(plugin) })
  }, badPlugins)
})

test('features can be added and called', t => {
  const client = createClient({ io })
  const plugin = send => {
    const features = {
      magic: () => 42
    }
    return { features }
  }
  client.addPlugin(plugin)
  t.is(typeof client.magic, 'function')
  t.is(client.magic(), 42)
})

test('you can overwrite other feature names', t => {
  const client = createClient({ io })
  const createPlugin = number => send => ({ features: { hello: () => number } })
  client.addPlugin(createPlugin(69))
  t.is(client.hello(), 69)
  client.addPlugin(createPlugin(9001))
  t.is(client.hello(), 9001)
})
