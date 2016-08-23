import test from 'ava'
import { createServer } from '../src'

test('has defaults', t => {
  const client = createServer({})
  t.is(client.options.port, 9090)
})

test('options can be overridden', t => {
  const server = createServer({ port: 1 })
  t.is(server.options.port, 1)
})

test('port is required', t => {
  t.throws(() => createServer({ port: null }))
  t.throws(() => createServer({ port: undefined }))
  t.throws(() => createServer({ port: 0 }))
  t.throws(() => createServer({ port: 65536 }))
})
