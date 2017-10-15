import * as getPort from 'get-port'
import { createServer } from '../src/reactotron-core-server'
import { Command } from '../src/types'
import * as WebSocket from 'ws'

const mock = { type: 'client.intro', payload: {} }

test('sends a valid command', async (done: any) => {
  const port = await getPort()
  const server = createServer({ port })

  server.on('command', (command: Command) => server.send(mock.type, mock.payload))
  server.start()

  // setup the client
  const client = new WebSocket(`ws://localhost:${port}`)

  // when the client receives a command from the server
  client.on('message', message => {
    const { type, payload } = JSON.parse(message.toString())
    if (type === mock.type) {
      server.stop()
      expect(type).toBe(mock.type)
      expect(payload).toEqual(mock.payload)
      done()
    }
  })

  client.on('open', () => client.send(JSON.stringify(mock)))
})
