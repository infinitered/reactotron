import test from 'ava'
import { createClient } from '../src'
import io from './_fake-io'

test('has a startTimer function', t => {
  const client = createClient({ io })
  t.is(typeof client.startTimer, 'function')
  const elapsed = client.startTimer()
  t.is(typeof elapsed, 'function')
})
