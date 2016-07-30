import test from 'ava'
import getFreePort from './_get-free-port'
import { createServer } from '../src'
import socketClient from './_socket-client'

test.cb('receives a valid command', t => {
  getFreePort(port => {
    const mockCommand = {
      type: 'hello.client',
      payload: { hi: 'there' }
    }

    const server = createServer({
      port,
      onCommand: ({ type, payload, messageId, date }) => {
        t.is(type, mockCommand.type)
        t.deepEqual(payload, mockCommand.payload)
        t.is(messageId, 1)
        t.truthy(date)
        t.is(server.messageId, 1)
        t.end()
      }
    }).start()

    // add
    const client = socketClient(`ws://localhost:${port}`)
    client.on('connect', () => {
      client.emit('command', mockCommand)
    })
  })
})
