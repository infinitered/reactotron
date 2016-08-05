import test from 'ava'
import { createClient, CorePlugins } from '../src'
import socketClient from 'socket.io-client'
import plugin from '../src/plugins/state-responses'

test('stateActionComplete', t => {
  const client = createClient({ io: socketClient })
  let type
  let name
  let action
  client.send = (x, y) => {
    type = x
    name = y.name
    action = y.action
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.stateActionComplete, 'function')
  client.stateActionComplete('name', { action: 123 })
  t.is(type, 'state.action.complete')
  t.is(name, 'name')
  t.deepEqual(action, { action: 123 })
})

test('stateValuesResponse', t => {
  const client = createClient({ io: socketClient })
  let type
  let path
  let value
  let valid = true
  client.send = (x, y) => {
    type = x
    path = y.path
    value = y.value
    valid = y.valid
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.stateValuesResponse, 'function')
  client.stateValuesResponse('user.password', 'password', false)
  t.is(type, 'state.values.response')
  t.is(path, 'user.password')
  t.is(value, 'password')
  t.false(valid)
})

test('stateKeysResponse', t => {
  const client = createClient({ io: socketClient })
  let type
  let path
  let keys
  let valid = true
  client.send = (x, y) => {
    type = x
    path = y.path
    keys = y.keys
    valid = y.valid
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.stateKeysResponse, 'function')
  client.stateKeysResponse('user', ['name', 'password'], false)
  t.is(type, 'state.keys.response')
  t.is(path, 'user')
  t.deepEqual(keys, ['name', 'password'])
  t.false(valid)
})

test('stateValuesChange', t => {
  const client = createClient({ io: socketClient })
  let type
  let changes
  client.send = (x, y) => {
    type = x
    changes = y.changes
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.stateValuesChange, 'function')
  client.stateValuesChange([{ path: 'a', value: 1 }, { path: 'b', value: 2 }])
  t.is(type, 'state.values.change')
  t.deepEqual(changes, [{ path: 'a', value: 1 }, { path: 'b', value: 2 }])
})
