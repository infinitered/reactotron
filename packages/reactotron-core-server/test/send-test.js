import test from 'ava'
import getFreePort from './_get-free-port'
import { createServer } from '../src'
import socketClient from './_socket-client'

const mockType = 'hello.server'
const mockPayload = { fun: true }

test.cb('sends a valid command', t => {
  getFreePort(port => {
    // setup a server, wait for a command, then send one
    const server = createServer({
      port,
      onCommand: ({ type, payload, messageId, date }) => {
        server.send(mockType, mockPayload)
      }
    }).start()

    // setup the client
    const client = socketClient(`ws://localhost:${port}`)

    // when the client receives a command, validate
    client.on('command', ({ type, payload }) => {
      if (type === 'state.values.subscribe') return
      t.is(type, mockType)
      t.deepEqual(payload, mockPayload)
      t.end()
    })

    // when the client connects, send a command trigger
    client.on('connect', () => {
      client.emit('command', { type: 'trigger' })
    })
  })
})
