import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('has defaults', t => {
  const client = createClient({ createSocket })
  t.is(client.options.host, 'localhost')
  t.is(client.options.port, 9090)
  t.is(client.options.name, 'reactotron-core-client')
})

test('options can be overridden', t => {
  const client = createClient({ createSocket, host: 'hey', port: 1 })
  t.is(client.options.host, 'hey')
  t.is(client.options.port, 1)
})

test('io is required', t => {
  t.throws(() => createClient())
  t.throws(() => createClient({}))
  t.throws(() => createClient({ createSocket: null }))
})

test('onCommand is required', t => {
  t.throws(() => createClient({ createSocket, onCommand: undefined }))
  t.throws(() => createClient({ createSocket, onCommand: null }))
})

test('host is required', t => {
  t.throws(() => createClient({ createSocket, host: undefined }))
  t.throws(() => createClient({ createSocket, host: null }))
  t.throws(() => createClient({ createSocket, host: '' }))
})

test('port is required', t => {
  t.throws(() => createClient({ createSocket, port: null }))
  t.throws(() => createClient({ createSocket, port: undefined }))
  t.throws(() => createClient({ createSocket, port: 0 }))
  t.throws(() => createClient({ createSocket, port: 65536 }))
})
