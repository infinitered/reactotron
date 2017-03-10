import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('returns a client', t => {
  const client = createClient({ createSocket })
  t.truthy(client)
})
