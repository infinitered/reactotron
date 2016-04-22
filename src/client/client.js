// --- Begin Awkward Hackzorz ---

const R = require('ramda')

// Then we set a userAgent so socket.io works.
if (!window.navigator || !window.navigator.userAgent) {
  const newNav = R.merge(window.navigator, {userAgent: 'reactotron'})
  window = R.merge(window, {navigator: newNav})
}

// Finally, we load socket.io. This has to be done as a require to preserve
// the order of user agent being set first.
const io = require('socket.io-client/socket.io')

// --- End Awkward Hackzorz ---

const RS = require('ramdasauce')
const performanceNow = require('fbjs/lib/performanceNow')

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

// handles requests to reload the app (current iOS only)
client.onCommand('devMenu.reload', (action, client) => {
  // doesn't seem to work on android.
  // const devMenu = RS.dotPath('NativeModules.DevMenu', React)
  // devMenu && devMenu.reload()
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
    const action = JSON.parse(data)
    const {type} = action
    const handlers = commandHandlers[type] || []
    R.forEach((handler) => { handler(action, client) }, handlers)
  })
  client.hookErrors()
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

client.createSubscriptionListener = (store) => {
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

  return sendSubscriptions
}

client.addReduxStore = (store) => {
  store.subscribe(client.createSubscriptionListener(store))

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

  return store
}

client.hookErrors = () => {
  // prevent double assignments
  if (console._swizzledFromReactotron) {
    return
  }

  // remember the previous one
  console._swizzledFromReactotron = console.error.bind(console)

  // swizzle and go straight to hell
  console.error = function reactotronConsoleOnError () {
    // always call the previous one
    console._swizzledFromReactotron.apply(null, arguments)
    const message = arguments[0]
    const stack = message && message.stack
    // if we have a message, pass it along
    if (message) {
      client.sendCommand('console.error', {message, stack})
    }
  }
}

// Returns a function that can track performance.
client.trackPerformance = (action) => {
  const {type} = action
  const start = performanceNow()

  const stopTracking = () => {
    const ms = (performanceNow() - start).toFixed(0)

    if (!R.contains(action.type, MIDDLEWARE_ACTION_IGNORE)) {
      client.sendCommand('redux.action.done', {type, ms, action})
    }
  }

  return stopTracking
}

const MIDDLEWARE_ACTION_IGNORE = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']

// Enhances the store by wrapping the main reducer
// with our own reduxReducer, as well as setting up
// the store listener.
client.storeEnhancer = () => {
  return next => (reducer, initialState, enhancer) => {
    const wrappedReducer = (state, action) => {
      // Begin tracking performance.
      const performanceTracker = client.trackPerformance(action)

      // Run the main reducer.
      const result = reducer(state, action)

      // Stop tracking performance.
      performanceTracker()

      return result
    }

    const store = next(wrappedReducer, initialState, enhancer)

    return client.addReduxStore(store)
  }
}

client.reduxMiddleware = (store) => (next) => (action) => {
  // Begin tracking performance.
  const performanceTracker = client.trackPerformance(action)

  const result = next(action)

  // Stop tracking performance.
  performanceTracker()

  return result
}

module.exports = client
