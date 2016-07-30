import test from 'ava'
import { createClient } from '../src'
import io from './_fake-io'

test('returns a client', t => {
  const client = createClient({ io })
  t.truthy(client)
})
