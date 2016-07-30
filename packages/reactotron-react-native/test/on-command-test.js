import test from 'ava'
import getFreePort from './_get-free-port'
import socketServer from 'socket.io'

// then call reactotron
var reactotron = require('../src').default

test.cb('client can receive a command', t => {
  getFreePort(port => {
    // create a server
    const server = socketServer(port)

    // when we get a connection
    server.on('connection', socket => {
      // send a command to the client
      socket.emit('command', {type: 'that', payload: 'that'})

      // sadly wait to assure the count worked
      setTimeout(() => {
        socket.disconnect()
        t.is(reactotron.count, 1)
        t.end()
      }, 20) // 10 seems to be the magic number... :(
    })

    // start off with 0 count
    t.is(reactotron.count, 0)

    // lets kick this off
    reactotron.connect({ port })
  })
})
