'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// --- Begin Awkward Hackzorz ---

var REACTOTRON_VERSION = '@@REACTOTRON_VERSION@@';
var R = require('ramda');

// client enabled flag
var reactotronEnabled = true;

// Then we set a userAgent so socket.io works.
if (!window.navigator || !window.navigator.userAgent) {
  window.navigator.userAgent = 'react-native';
}

// Finally, we load socket.io. This has to be done as a require to preserve
// the order of user agent being set first.
var io = require('socket.io-client/socket.io');

// --- End Awkward Hackzorz ---

var RS = require('ramdasauce');
var performanceNow = require('fbjs/lib/performanceNow');

// me?  not much, just creating some
// global mutable variables.
var socket = null;

// the thing that shall be returned from this file
var client = {};

// inbound command handlers
var commandHandlers = {};

// a way to register command handlers
client.onCommand = function (event, handler) {
  commandHandlers[event] = commandHandlers[event] || [];
  commandHandlers[event].push(handler);
};

// handles requests to reload the app (current iOS only)
client.onCommand('devMenu.reload', function (action, client) {
  // doesn't seem to work on android.
  // const devMenu = RS.dotPath('NativeModules.DevMenu', React)
  // devMenu && devMenu.reload()
});

/**
  Connect to the server.
  @param userConfigurations Client configuration for connecting to Reactotron
  @param {string} userConfigurations.name Name of the client, displayed in the dashboard
  @param {string} userConfigurations.server IP of the server to connect to
  @param {number} userConfigurations.port Port of the server to connect to
  @param {boolean} userConfigurations.enabled Whether or not Reactotron is enabled.
 */
client.connect = function () {
  var userConfigurations = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var defaults = {
    name: 'React',
    version: REACTOTRON_VERSION,
    server: 'localhost',
    port: 3334,
    enabled: true
  };

  // merge user input with defaults
  var config = _extends({}, defaults, userConfigurations);

  // keep track for all ops
  reactotronEnabled = config.enabled;

  if (config.enabled) {
    socket = io('ws://' + config.server + ':' + config.port, {
      jsonp: false,
      transports: ['websocket']
    });

    socket.on('connect', function () {
      socket.emit('ready', config);
    });

    socket.on('command', function (data) {
      var action = JSON.parse(data);
      var type = action.type;

      var handlers = commandHandlers[type] || [];
      R.forEach(function (handler) {
        handler(action, client);
      }, handlers);
    });

    client.hookErrors();
  }
};

/**
  Log out something to the server.
 */
client.log = function (message) {
  client.sendCommand('content.log', message);
};

/**
  Log out something to the server.
 */
client.apiLog = function (response, title) {
  client.sendCommand('api.log', { response: response, title: title });
};

client.sendCommand = function (type, message) {
  var payload = { type: type, message: message };
  if (socket) {
    socket.emit('command', JSON.stringify(payload));
  }
};

client.createSubscriptionListener = function (store) {
  // shortcircuit if disabled
  if (!reactotronEnabled) return store;
  var subscriptions = [];

  // send the subscriptions to the client
  var sendSubscriptions = function sendSubscriptions() {
    var state = store.getState();
    var expanded = R.pipe(R.filter(RS.endsWith('.*')), R.map(function (key) {
      var keyMinusWildcard = R.slice(0, -2, key);
      var value = RS.dotPath(keyMinusWildcard, state);
      if (R.is(Object, value) && !RS.isNilOrEmpty(value)) {
        return R.pipe(R.keys, R.map(function (key) {
          return keyMinusWildcard + '.' + key;
        }))(value);
      }
      return null;
    }), R.concat(subscriptions), R.flatten, R.reject(RS.endsWith('.*')), R.uniq, R.sortBy(R.identity))(subscriptions);

    var values = R.map(function (key) {
      return [key, RS.dotPath(key, state)];
    }, expanded);
    client.sendCommand('redux.subscribe.values', { values: values });
  };

  client.onCommand('redux.subscribe.request', function (action, client) {
    subscriptions = R.flatten(R.clone(action.paths || []));
    sendSubscriptions();
  });

  return sendSubscriptions;
};

client.addReduxStore = function (store) {
  store.subscribe(client.createSubscriptionListener(store));

  // return the store at the given path
  client.onCommand('redux.value.request', function (action, client) {
    var path = action.path;
    var state = store.getState();
    if (RS.isNilOrEmpty(path)) {
      client.sendCommand('redux.value.response', { path: null, values: state });
    } else {
      client.sendCommand('redux.value.response', { path: path, values: RS.dotPath(path, state) });
    }
  });

  // return the keys at the given path
  client.onCommand('redux.key.request', function (action, client) {
    var path = action.path;
    var state = store.getState();
    if (RS.isNilOrEmpty(path)) {
      client.sendCommand('redux.key.response', { path: null, keys: R.keys(state) });
    } else {
      var keys = R.keys(RS.dotPath(path, state));
      client.sendCommand('redux.key.response', { path: path, keys: keys });
    }
  });

  // dispatch an action
  client.onCommand('redux.dispatch', function (action, client) {
    store.dispatch(action.action);
  });

  return store;
};

client.hookErrors = function () {
  // prevent double assignments
  if (console._swizzledFromReactotron) {
    return;
  }

  // remember the previous one
  console._swizzledFromReactotron = console.error.bind(console);

  // swizzle and go straight to hell
  console.error = function reactotronConsoleOnError() {
    // always call the previous one
    console._swizzledFromReactotron.apply(null, arguments);
    var message = arguments[0];
    var stack = message && message.stack;
    // if we have a message, pass it along
    if (message) {
      client.sendCommand('console.error', { message: message, stack: stack });
    }
  };
};

var MIDDLEWARE_ACTION_IGNORE = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED'];

// Returns a function that can track performance.
client.trackPerformance = function (action) {
  var type = action.type;

  var start = performanceNow();

  var stopTracking = function stopTracking() {
    var ms = (performanceNow() - start).toFixed(0);

    if (!R.contains(action.type, MIDDLEWARE_ACTION_IGNORE)) {
      client.sendCommand('redux.action.done', { type: type, ms: ms, action: action });
    }
  };

  return stopTracking;
};

// Enhances the store by wrapping the main reducer
// with our own reduxReducer, as well as setting up
// the store listener.
client.storeEnhancer = function () {
  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      // create this store
      var store = createStore(reducer, initialState, enhancer);

      // jet with what we got if the master switch is off
      if (!reactotronEnabled) return store;

      // fish out the previous dispatch
      var previousDispatch = store.dispatch;

      // create a new dispatch that times & calls the previous one
      var dispatch = function dispatch(action) {
        var stopTracking = client.trackPerformance(action);
        var result = previousDispatch(action);
        stopTracking();
        return result;
      };

      // attach the subscription to the store
      client.addReduxStore(store);

      // return the store but with our new dispatcher
      return R.merge(store, { dispatch: dispatch });
    };
  };
};

client.reduxMiddleware = function (store) {
  return function (next) {
    return function (action) {
      if (!reactotronEnabled) {
        return next(action);
      }

      // Begin tracking performance.
      var performanceTracker = client.trackPerformance(action);

      var result = next(action);

      // Stop tracking performance.
      performanceTracker();

      return result;
    };
  };
};

client.bench = function (title) {
  var steps = [];
  var step = function step(stepTitle) {
    return steps.push({ title: stepTitle, time: performanceNow() });
  };
  step(title);
  var stop = function stop(stopTitle) {
    step(stopTitle);
    client.sendCommand('bench.report', { title: title, steps: steps });
  };
  return { step: step, stop: stop };
};

module.exports = client;