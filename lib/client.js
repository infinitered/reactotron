import React from 'react-native'
import './useragent' // needs to be included before socket.io!
import io from 'socket.io-client/socket.io'
import R from 'ramda'
import RS from 'ramdasauce'

// me?  not much, just creating some
// global mutable variables.
let socket = null

// the thing that shall be returned from this file
const client = {}

// inbound command handlers
const commandHandlers = {}

// a way to register command handlers
client.onCommand = (event, handler) => {
  commandHandlers[event] = commandHandlers[event] || []
  commandHandlers[event].push(handler)
}

// add a sample log handler
client.onCommand('log', (action, client) => {
  console.log(action)
})

/**
  Connect to the server.
  @param {String} server The server to connect to.
  @param {Number} port The port to use (default 3334)
 */
client.connect = (server = 'localhost', port = 3334) => {
  socket = io(`ws://${server}:${port}`, {
    jsonp: false,
    transports: ['websocket']
  })
  socket.on('connect', () => {
    console.log('connected')
  })
  socket.on('command', (data) => {
    console.log('command data: ', data)
    const action = JSON.parse(data)
    const {type} = action
    const handlers = commandHandlers[type] || []
    R.forEach((handler) => {
      handler(action, client)
    }, handlers)
    // console.log({type, payload})
  })
}

/**
  Log out something to the server.
 */
client.log = (message) => {
  const payload = {type: 'log', message}
  if (socket) {
    socket.emit('event', JSON.stringify(payload))
  }
}

client.addReduxStore = (store) => {
  // return the store at the given path
  client.onCommand('redux.store', (action, client) => {
    const path = action.payload.path
    const state = store.getState()
    if (RS.isNilOrEmpty(path)) {
      client.log(state)
    } else {
      client.log(RS.dotPath(path, state))
    }
  })

  // return the keys at the given path
  client.onCommand('redux.keys', (action, client) => {
    const path = action.payload.path
    const state = store.getState()
    if (RS.isNilOrEmpty(path)) {
      client.log(R.keys(state))
    } else {
      client.log(R.keys(RS.dotPath(path, state)))
    }
  })

  // dispatch an action
  client.onCommand('redux.dispatch', (action, client) => {
    console.log({action})
    store.dispatch(action.payload.action)
  })

}

client.addReduxActionCreators = (creators) => {

}

export default client
module.export = client
