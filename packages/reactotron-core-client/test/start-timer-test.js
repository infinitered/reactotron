import test from 'ava'
import { createClient } from '../src'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('has a startTimer function', t => {
  const client = createClient({ createSocket })
  t.is(typeof client.startTimer, 'function')
  const elapsed = client.startTimer()
  t.is(typeof elapsed, 'function')
})
