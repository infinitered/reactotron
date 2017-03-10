import test from 'ava'
import { createClient } from '../src'
import R from 'ramda'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('features must be an object if they appear', t => {
  const client = createClient({ createSocket })
  t.throws(() => client.use(reactotron => ({ features: 1 })))
})

test('some names are not allowed', t => {
  const client = createClient({ createSocket })
  const createPlugin = features => reactotron => ({features})

  const badPlugins = R.map(
    name => createPlugin({ [name]: R.identity }),
    ['options', 'connected', 'socket', 'plugins', 'configure', 'connect', 'send', 'use', 'startTimer']
  )

  R.forEach(plugin => {
    t.throws(() => { client.use(plugin) })
  }, badPlugins)
})

test('features can be added and called', t => {
  const client = createClient({ createSocket })
  const plugin = () => reactotron => {
    const features = {
      magic: () => 42
    }
    return { features }
  }
  client.use(plugin())
  t.is(typeof client.magic, 'function')
  t.is(client.magic(), 42)
})

test('you can overwrite other feature names', t => {
  const client = createClient({ createSocket })
  const createPlugin = number => reactotron => ({ features: { hello: () => number } })
  client.use(createPlugin(69))
  t.is(client.hello(), 69)
  client.use(createPlugin(9001))
  t.is(client.hello(), 9001)
})
