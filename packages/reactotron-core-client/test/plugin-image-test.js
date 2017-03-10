import test from 'ava'
import { createClient, CorePlugins } from '../src'
import plugin from '../src/plugins/image'
import WebSocket from 'ws'

const createSocket = path => new WebSocket(path)

test('the image function send the right data', t => {
  const client = createClient({ createSocket })
  const results = []
  client.send = (type, payload) => { results.push({type, payload}) }
  client.use(plugin())
  t.is(client.plugins.length, CorePlugins.length + 1)
  t.is(typeof client.image, 'function')
  client.image({
    uri: 'a',
    width: 1,
    height: 2,
    filename: 'f',
    preview: 'p',
    caption: 'c',
    zoo: 'lol'
  })
  t.is(results.length, 1)
  t.is(results[0].type, 'image')
  t.is(results[0].payload.uri, 'a')
  t.is(results[0].payload.width, 1)
  t.is(results[0].payload.height, 2)
  t.is(results[0].payload.filename, 'f')
  t.is(results[0].payload.preview, 'p')
  t.is(results[0].payload.caption, 'c')
  t.is(results[0].payload.zoo, undefined)
})
