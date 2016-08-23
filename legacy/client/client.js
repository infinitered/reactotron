// --- Begin Awkward Hackzorz ---

const REACTOTRON_VERSION = '@@REACTOTRON_VERSION@@'
const R = require('ramda')

// client enabled flag
let reactotronEnabled = true

// Then we set a userAgent so socket.io works.
if (!window.navigator || !window.navigator.userAgent) {
  window.navigator.userAgent = 'react-native'
}

// Finally, we load socket.io. This has to be done as a require to preserve
// the order of user agent being set first.
var io = require('socket.io-client/socket.io')

// --- End Awkward Hackzorz ---

const RS = require('ramdasauce')
const defaultPerformanceNow = () => Date.now()
const nativePerformance = window && (window.performance || window.msPerformance || window.webkitPerformance)
const nativePerformanceNow = () => nativePerformance.now()
const performanceNow = nativePerformance ? nativePerformanceNow : defaultPerformanceNow

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

/*
 * Get React Native server IP if hostname is `localhost`
 * On Android emulator, the IP of host is `10.0.2.2` (Genymotion: 10.0.3.2)
 */
function getHost(hostname) {
  if (
    (hostname === 'localhost' || hostname === '127.0.0.1') &&
    typeof window !== 'undefined' &&
    window.__fbBatchedBridge &&
    window.__fbBatchedBridge.RemoteModules &&
    window.__fbBatchedBridge.RemoteModules.AndroidConstants
  ) {
    const {
      ServerHost = hostname
    } = window.__fbBatchedBridge.RemoteModules.AndroidConstants;
    return ServerHost.split(':')[0];
  }

  return hostname;
}

/**
  Connect to the server.
  @param userConfigurations Client configuration for connecting to Reactotron
  @param {string} userConfigurations.name Name of the client, displayed in the dashboard
  @param {string} userConfigurations.server IP of the server to connect to
  @param {number} userConfigurations.port Port of the server to connect to
  @param {boolean} userConfigurations.enabled Whether or not Reactotron is enabled.
 */
client.connect = (userConfigurations = {}) => {
  const defaults = {
    name: 'React',
    version: REACTOTRON_VERSION,
    server: 'localhost',
    port: 3334,
    enabled: true,
    secure: false
  }

  // merge user input with defaults
  const config = {
    ...defaults,
    ...userConfigurations,
    server: getHost(userConfigurations.server || defaults.server)
  }

  // keep track for all ops
  reactotronEnabled = config.enabled

  if (config.enabled) {
    socket = io(`${config.secure ? 'wss' : 'ws'}://${config.server}:${config.port}`, {
      jsonp: false,
      transports: ['websocket']
    })

    socket.on('connect', () => {
      socket.emit('ready', config)
    })

    socket.on('command', (data) => {
      const action = JSON.parse(data)
      const {type} = action
      const handlers = commandHandlers[type] || []
      R.forEach((handler) => { handler(action, client) }, handlers)
    })

    client.hookErrors()
  }
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
  // shortcircuit if disabled
  if (!reactotronEnabled) return store
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
    if (R.length(values) > 0) {
      client.sendCommand('redux.subscribe.values', {values})
    }
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

const MIDDLEWARE_ACTION_IGNORE = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']

// Returns a function that can track performance.
client.trackPerformance = (action) => {
  let {type} = action
  const start = performanceNow()

  const stopTracking = () => {
    const ms = (performanceNow() - start).toFixed(0)

    if (!R.contains(action.type, MIDDLEWARE_ACTION_IGNORE)) {
      // Transform Symbol to Text
      if (typeof type === 'symbol') {
        type = type.toString().replace(/^Symbol\(/, '').replace(/\)$/, '');
      }

      client.sendCommand('redux.action.done', {type, ms, action})
    }
  }

  return stopTracking
}

// Enhances the store by wrapping the main reducer
// with our own reduxReducer, as well as setting up
// the store listener.
client.storeEnhancer = () => {
  return (createStore) => (reducer, initialState, enhancer) => {
    // create this store
    const store = createStore(reducer, initialState, enhancer)

    // jet with what we got if the master switch is off
    if (!reactotronEnabled) return store

    // fish out the previous dispatch
    const previousDispatch = store.dispatch

    // create a new dispatch that times & calls the previous one
    const dispatch = (action) => {
      const stopTracking = client.trackPerformance(action)
      const result = previousDispatch(action)
      stopTracking()
      return result
    }

    // attach the subscription to the store
    client.addReduxStore(store)

    // return the store but with our new dispatcher
    return R.merge(store, {dispatch})
  }
}

client.reduxMiddleware = (store) => (next) => (action) => {
  if (!reactotronEnabled) {
    return next(action)
  }

  // Begin tracking performance.
  const performanceTracker = client.trackPerformance(action)

  const result = next(action)

  // Stop tracking performance.
  performanceTracker()

  return result
}

client.bench = (title) => {
  const steps = []
  const step = (stepTitle) => steps.push({title: stepTitle, time: performanceNow()})
  step(title)
  const stop = (stopTitle) => {
    step(stopTitle)
    client.sendCommand('bench.report', {title, steps})
  }
  return {step, stop}
}

module.exports = client
