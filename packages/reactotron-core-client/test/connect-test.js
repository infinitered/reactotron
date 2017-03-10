import test from 'ava'
import { createClient } from '../src'
import { createServer } from 'http'
import WebSocket from 'ws'

let server
let wss
let port
test.cb.beforeEach(t => {
  server = createServer()
  wss = new WebSocket.Server({ server })
  server.listen(() => {
    port = server.address().port
    t.end()
  })
})

test.afterEach.always(() => {
  server.close()
})

const createSocket = path => new WebSocket(path)

test('has a connect method', t => {
  const client = createClient({ createSocket })
  t.truthy(client.connect)
})

test.cb('connect returns itself', t => {
  const client = createClient({ createSocket, port })
  t.is(client.connect(), client)
  wss.on('connection', () => {
    server.close()
    t.end()
  })
})

test('we start off unconnected', t => {
  t.false(createClient({ createSocket }).connected)
})

test.cb('connecting shows us a connected', t => {
  t.true(createClient({ createSocket, port }).connect().connected)
  wss.on('connection', () => {
    server.close()
    t.end()
  })
})

test.cb('builds a socket', t => {
  const client = createClient({ createSocket, port })
  client.connect()
  t.truthy(client.socket)
  wss.on('connection', () => {
    server.close()
    t.end()
  })
})
