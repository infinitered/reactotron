import { createServer } from '../src/reactotron-core-server'

test('has default port', () => {
  const client = createServer()
  expect(client.options.port).toBe(9090)
})

test('options can be overridden', () => {
  const server = createServer({ port: 1 })
  expect(server.options.port).toBe(1)
})

test('port must be valid', () => {
  expect(() => createServer({ port: null })).toThrow()
  expect(() => createServer({ port: undefined })).toThrow()
  expect(() => createServer({ port: 0 })).toThrow()
  expect(() => createServer({ port: 65536 })).toThrow()
})
