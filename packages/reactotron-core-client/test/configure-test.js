import test from 'ava'
import { createClient } from '../src'
import io from './_fake-io'

test('has defaults', t => {
  const client = createClient({io})
  t.is(client.options.host, 'localhost')
  t.is(client.options.port, 9090)
  t.is(client.options.name, 'reactotron-core-client')
})

test('options can be overridden', t => {
  const client = createClient({ io, host: 'hey', port: 1 })
  t.is(client.options.host, 'hey')
  t.is(client.options.port, 1)
})

test('io is required', t => {
  t.throws(() => createClient())
  t.throws(() => createClient({}))
  t.throws(() => createClient({ io: null }))
})

test('onCommand is required', t => {
  t.throws(() => createClient({ io, onCommand: undefined }))
  t.throws(() => createClient({ io, onCommand: null }))
})

test('host is required', t => {
  t.throws(() => createClient({ io, host: undefined }))
  t.throws(() => createClient({ io, host: null }))
  t.throws(() => createClient({ io, host: '' }))
})

test('port is required', t => {
  t.throws(() => createClient({ io, port: null }))
  t.throws(() => createClient({ io, port: undefined }))
  t.throws(() => createClient({ io, port: 0 }))
  t.throws(() => createClient({ io, port: 65536 }))
})
