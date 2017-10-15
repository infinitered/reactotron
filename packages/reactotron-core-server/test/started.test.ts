import * as getPort from 'get-port'
import { createServer } from '../src/reactotron-core-server'

test('sets the started flag', async () => {
  const port = await getPort()
  const server = createServer({ port })
  expect(server.started).toBe(false)
  server.start()
  expect(server.started).toBe(true)
  server.stop()
  expect(server.started).toBe(false)
})
