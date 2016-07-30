import test from 'ava'
import getFreePort from './_get-free-port'
import { createServer } from '../src'

test.cb('sets the started flag', t => {
  getFreePort(port => {
    const server = createServer({ port })
    t.false(server.started)
    server.start()
    t.true(server.started)
    server.stop()
    t.false(server.started)
    t.end()
  })
})
