import React from 'react-native'
import './UserAgent' // needs to be included before socket.io!
import io from 'socket.io-client/socket.io'

// me?  not much, just creating some
// global mutable variables.
let socket = null

/**
  Connect to the server.
  @param {String} server The server to connect to.
  @param {Number} port The port to use (default 3334)
 */
const connect = (server = 'localhost', port = 3334) => {
  socket = io(`ws://${server}:${port}`, {
    jsonp: false,
    transports: ['websocket']
  })
  socket.on('connect', () => {
    console.log('connected')
  })
  socket.on('command', (data) => {
    const action = JSON.parse(data)
    console.log({action})
  })
}

/**
  Log out something to the server.
 */
const log = (message) => {
  const payload = {type: 'log', message}
  socket.emit('event', JSON.stringify(payload))
}

/**
  The interface.
*/
const client = {
  connect,
  log
}

export default client
module.export = client
