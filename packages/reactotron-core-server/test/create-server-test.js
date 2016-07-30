import test from 'ava'
import { createServer } from '../src'

test('returns a server', t => {
  const server = createServer()
  t.truthy(server)
})
