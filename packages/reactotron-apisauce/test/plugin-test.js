import test from 'ava'
import jsonServer from 'json-server'
import getFreePort from './_get-free-port'
import apisauce from 'apisauce'
import createPlugin from '../src/index'

test.cb('parses responses', t => {
  getFreePort(port => {
    // create a json server
    const server = jsonServer.create()

    // hookup some leet server codez
    server.get('/hey', (req, res) => {
      res.json({ a: 'ok', b: 1 })
    })

    // start listening
    server.listen(port)

    // captured these guys from our fake plugin
    let request
    let response
    let duration

    // create a fake plugin to receive the real plugin's functionality
    const plugin = createPlugin()({
      apiResponse: (a, b, c) => {
        request = a
        response = b
        duration = c
      }
    })

    // create the api
    const api = apisauce.create({ baseURL: `http://localhost:${port}` })

    // make the call
    api
      .get('/hey')
      .then(plugin.features.apisauce)
      .then(() => {
        // can't seem to deep equals here... it's like we're getting a wierd Object()
        t.is(request.url, `http://localhost:${port}/hey`)
        t.is(request.method, 'get')
        t.is(request.headers['Accept'], 'application/json')
        t.falsy(request.data)
        t.deepEqual(response.body, {a: 'ok', b: 1})
        t.is(response.status, 200)
        t.is(response.headers['x-powered-by'], 'Express')
        t.true(duration > 0)
        t.end()
      })
  })
})
