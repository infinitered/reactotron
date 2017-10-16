import { createClient } from '../src/reactotron-core-client'
import { forEach, identity, map } from 'ramda'
import * as WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('features must be an object if they appear', () => {
  const client = createClient({ createSocket })
  const badPlugin = () => client.use(reactotron => ({ features: 1 }))
  expect(badPlugin).toThrow()
})

test('some names are not allowed', () => {
  const client = createClient({ createSocket })
  const createPlugin = features => reactotron => ({ features })

  const badPlugins = map(name => createPlugin({ [name]: identity }), [
    'options',
    'connected',
    'socket',
    'plugins',
    'configure',
    'connect',
    'send',
    'use',
    'startTimer',
  ])

  forEach(plugin => {
    expect(() => client.use(plugin)).toThrow()
  }, badPlugins)
})

test('features can be added and called', () => {
  const client: any = createClient({ createSocket })
  const plugin = () => reactotron => {
    const features = {
      magic: () => 42,
    }
    return { features }
  }
  client.use(plugin())
  expect(typeof client.magic).toBe('function')
  expect(client.magic()).toBe(42)
})

test('you can overwrite other feature names', () => {
  const client: any = createClient({ createSocket })
  const createPlugin = number => reactotron => ({ features: { hello: () => number } })
  client.use(createPlugin(69))
  expect(client.hello()).toBe(69)
  client.use(createPlugin(9001))
  expect(client.hello()).toBe(9001)
})
