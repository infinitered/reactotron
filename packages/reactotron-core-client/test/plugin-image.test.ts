import { createClient, corePlugins } from '../src/reactotron-core-client'
import plugin from '../src/plugins/image'
import * as WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('the image function send the right data', () => {
  const client: any = createClient({ createSocket })
  const results = []
  client.send = (type, payload) => {
    results.push({ type, payload })
  }
  client.use(plugin())
  expect(client.plugins.length).toBe(corePlugins.length + 1)
  expect(typeof client.image).toBe('function')
  client.image({
    uri: 'a',
    width: 1,
    height: 2,
    filename: 'f',
    preview: 'p',
    caption: 'c',
    zoo: 'lol',
  })
  expect(results.length).toBe(1)
  expect(results[0].type).toBe('image')
  expect(results[0].payload.uri).toBe('a')
  expect(results[0].payload.width).toBe(1)
  expect(results[0].payload.height).toBe(2)
  expect(results[0].payload.filename).toBe('f')
  expect(results[0].payload.preview).toBe('p')
  expect(results[0].payload.caption).toBe('c')
  expect(results[0].payload.zoo).toBe(undefined)
})
