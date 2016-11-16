import test from 'ava'
import { createClient } from '../src'
import socketServer from 'socket.io'
import socketClient from 'socket.io-client'
import getFreePort from './_get-free-port'

const mockType = 'GO!'

test.cb('handles sending circular references & functions', t => {
  const mockPayload = {}
  const o = {}
  o.foo = { x: 1 }
  o.bar = o
  mockPayload.string = 'String'
  mockPayload.number = 69
  mockPayload.object = o
  mockPayload.list = [
    o,
    mockPayload.string,
    'literally a string',
    mockPayload.number,
    o
  ]
  mockPayload.fn = function hello () {}
  mockPayload.anonymous = () => {}

  getFreePort(port => {
    const server = socketServer(port)
    server.on('connection', socket => {
      socket.on('command', ({type, payload}) => {
        if (type === 'client.intro') return
        t.is(payload.string, 'String')
        t.is(payload.number, 69)
        t.is(payload.object.foo.x, 1)
        t.is(payload.object.bar, '~~~ Circular Reference ~~~')
        t.is(payload.list[0].bar, '~~~ Circular Reference ~~~')
        t.is(payload.list[1], 'String')
        t.is(payload.list[2], 'literally a string')
        t.is(payload.list[3], 69)
        t.is(payload.list[4].bar, '~~~ Circular Reference ~~~')
        t.is(payload.fn, '~~~ hello() ~~~')
        t.is(payload.anonymous, '~~~ Anonymous Function ~~~')

        t.end()
      })
    })

    // client should send the command
    const client = createClient({ io: socketClient, port: port })
    client.connect()
    client.send(mockType, mockPayload)
  })
})
