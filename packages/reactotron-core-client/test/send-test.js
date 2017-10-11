import test from 'ava'
import { createClient } from '../src'
import socketServer from 'socket.io'
import socketClient from 'socket.io-client'
import getFreePort from './_get-free-port'

const mockType = 'GO!'
const mockPayload = [1, 2, 'three', { four: true }]

test.cb('sends a valid command', t => {
  getFreePort(port => {
    // the server waits for the command
    const server = socketServer(port)
    server.on('connection', socket => {
      socket.on('command', ({ type, payload }) => {
        if (type === 'client.intro') return
        t.is(type, mockType)
        t.deepEqual(payload, mockPayload)
        t.end()
      })
    })

    // client should send the command
    const client = createClient({ io: socketClient, port: port })
    client.connect()
    client.send(mockType, mockPayload)
  })
})
