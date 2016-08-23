import test from 'ava'
import { createClient, CorePlugins } from '../src'
import socketClient from 'socket.io-client'
import plugin from '../src/plugins/api-response'

test('apiResponse', t => {
  const client = createClient({ io: socketClient })
  let type
  let request
  let response
  let duration
  client.send = (x, y) => {
    type = x
    request = y.request
    response = y.response
    duration = y.duration
  }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.apiResponse, 'function')
  client.apiResponse(
    {a: 1},
    {b: 2},
    12
  )
  t.is(type, 'api.response')
  t.deepEqual(request, { a: 1 })
  t.deepEqual(response, { b: 2 })
  t.is(duration, 12)
})
