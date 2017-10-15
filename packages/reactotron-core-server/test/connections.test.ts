import * as getPort from 'get-port'
import { createServer } from '../src/reactotron-core-server'
import { Command } from '../src/types'
import * as WebSocket from 'ws'

const mock = { type: 'client.intro', payload: {} }

test('keeps track of connections', async (done: any) => {
  const port = await getPort()
  const server = createServer({ port })

  // when we get a command
  server.on('command', (command: Command) => {
    expect(server.connections.length).toBe(1)
    server.send('hi', {})
    server.stop()
  })

  server.start()
  expect(server.connections.length).toBe(0)

  // setup the client
  const client = new WebSocket(`ws://localhost:${port}`)
  client.on('open', () => client.send(JSON.stringify(mock)))
  client.on('close', () => done())
  client.on('message', message => client.close())
})
