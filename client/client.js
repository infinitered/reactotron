// --- Begin Awkware Hackzorz ---

// First we import React Native.
import React from 'react-native'

// Then we set a userAgent so socket.io works.
if (window.navigator && Object.keys(window.navigator).length === 0) {
  window = Object.assign(window, {navigator: {userAgent: 'react-native-puppeteer'}})
}

// Finally, we load socket.io. This has to be done as a require to preserve
// the order of user agent being set first.
const io = require('socket.io-client/socket.io')

// --- End Awkward Hackzorz ---

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
client.onCommand('content.log', (action, client) => {
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
    client.log('connected')
  })
  socket.on('command', (data) => {
    // console.log('command data: ', data)
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
  client.sendCommand('content.log', message)
}

/**
  Log out something to the server.
 */
client.apiLog = (response, title) => {
  client.sendCommand('api.log', {response, title})
}

client.sendCommand = (type, message) => {
  const payload = {type, message}
  if (socket) {
    socket.emit('command', JSON.stringify(payload))
  }
}

client.addReduxStore = (store) => {
  let subscriptions = []

  // send the subscriptions to the client
  const sendSubscriptions = () => {
    const state = store.getState()
    const expanded = R.pipe(
      R.filter(RS.endsWith('.*')),
      R.map((key) => {
        const keyMinusWildcard = R.slice(0, -2, key)
        const value = RS.dotPath(keyMinusWildcard, state)
        if (R.is(Object, value) && !RS.isNilOrEmpty(value)) {
          return R.pipe(
            R.keys,
            R.map((key) => `${keyMinusWildcard}.${key}`)
          )(value)
        }
        return null
      }),
      R.concat(subscriptions),
      R.flatten,
      R.reject(RS.endsWith('.*')),
      R.uniq,
      R.sortBy(R.identity)
    )(subscriptions)

    const values = R.map((key) => [key, RS.dotPath(key, state)], expanded)
    client.sendCommand('redux.subscribe.values', {values})
  }

  client.onCommand('redux.subscribe.request', (action, client) => {
    subscriptions = R.flatten(R.clone(action.paths || []))
    sendSubscriptions()
  })

  store.subscribe(sendSubscriptions)

  // return the store at the given path
  client.onCommand('redux.value.request', (action, client) => {
    const path = action.path
    const state = store.getState()
    if (RS.isNilOrEmpty(path)) {
      client.sendCommand('redux.value.response', {path: null, values: state})
    } else {
      client.sendCommand('redux.value.response', {path: path, values: RS.dotPath(path, state)})
    }
  })

  // return the keys at the given path
  client.onCommand('redux.key.request', (action, client) => {
    const path = action.path
    const state = store.getState()
    if (RS.isNilOrEmpty(path)) {
      client.sendCommand('redux.key.response', {path: null, keys: R.keys(state)})
    } else {
      const keys = R.keys(RS.dotPath(path, state))
      client.sendCommand('redux.key.response', {path, keys})
    }
  })

  // dispatch an action
  client.onCommand('redux.dispatch', (action, client) => {
    store.dispatch(action.action)
  })

}

client.addReduxActionCreators = (creators) => {
}

const MIDDLEWARE_ACTION_IGNORE = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']

client.reduxMiddleware = (store) => (next) => (action) => {
  const {type} = action
  const start = performance.now()
  const result = next(action)
  const ms = (performance.now() - start).toFixed(2)
  if (!R.contains(action.type, MIDDLEWARE_ACTION_IGNORE)) {
    client.sendCommand('redux.action.done', {type, ms, action})
  }
  return result
}

export default client
module.export = client
