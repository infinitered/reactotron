import test from 'ava'
import { createClient } from '../src'
import socketServer from 'socket.io'
import socketClient from 'socket.io-client'
import getFreePort from './_get-free-port'
import io from './_fake-io'

const mockType = 'TEST'
const mockPayload = [1, 2, 'three', { four: true }]

test('the default onCommand does nothing', t => {
  const client = createClient({ io })
  t.falsy(client.options.onCommand())
})

test.cb('receives a valid command', t => {
  getFreePort(port => {
    // client should receive the command
    const client = createClient({
      io: socketClient,
      port: port,
      onCommand: ({ type, payload }) => {
        t.is(type, mockType)
        t.deepEqual(payload, mockPayload)
        t.end()
      }
    })

    // when the server gets a connection, send the command
    const server = socketServer(port)
    server.on('connection', socket => {
      server.sockets.emit('command', { type: mockType, payload: mockPayload })
    })

    // kick it off
    client.connect()
  })
})
