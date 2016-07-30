import test from 'ava'
import { createClient } from '../src'
import io from './_fake-io'

test('has a connect method', t => {
  const client = createClient({ io })
  t.truthy(client.connect)
})

test('connect returns itself', t => {
  const client = createClient({ io })
  t.is(client.connect(), client)
})

test('we start off unconnected', t => {
  t.false(createClient({ io }).connected)
})

test('connecting shows us a connected', t => {
  t.true(createClient({ io }).connect().connected)
})

test('builds a socket', t => {
  const client = createClient({ io })
  client.connect()
  t.truthy(client.socket)
})
