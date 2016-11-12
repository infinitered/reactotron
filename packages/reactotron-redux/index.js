'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var R = require('ramda');
var R__default = _interopDefault(R);
var redux = require('redux');
var RS = _interopDefault(require('ramdasauce'));

// Creates a replacement reducer so we can listen for Reactotron messages
// to clobber the state from the outside.
var DEFAULT_REPLACER_TYPE = 'REACTOTRON_RESTORE_STATE';

// creates a reducer which wraps the passed rootReducer
var createReplacementReducer = (function (rootReducer) {
  var actionName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_REPLACER_TYPE;

  // return this reducer
  return function (state, action) {
    // is this action the one we're waiting for?  if so, use the state it passed
    var whichState = action.type === actionName ? action.state : state;
    return rootReducer(whichState, action);
  };
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var DEFAULTS = {};var createActionTracker = (function (reactotron) {
  var trackerOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // verify reactotron is sane
  if (!(R.is(Object, reactotron) && typeof reactotron.use === 'function')) {
    throw new Error('invalid reactotron passed');
  }

  // assemble a crack team of options to use
  var options = R.merge(DEFAULTS, trackerOptions);
  var exceptions = R.concat([DEFAULT_REPLACER_TYPE], options.except || []);

  // the store enhancer
  return function (next) {
    return function (reducer, initialState, enhancer) {
      // create the original store
      var store = next(reducer, initialState, enhancer);

      // return a new store
      return _extends({}, store, {

        // and a brand new dispatch function that wraps the old dispatch
        dispatch: function dispatch(action) {
          // start a timer
          var elapsed = reactotron.startTimer();

          // call the original dispatch that actually does the real work
          var result = store.dispatch(action);

          // stop the timer
          var ms = elapsed();

          // action not blacklisted?
          if (!R.contains(action.type, exceptions)) {
            // check if the app considers this important
            var important = false;
            if (trackerOptions && typeof trackerOptions.isActionImportant === 'function') {
              important = !!trackerOptions.isActionImportant(action);
            }

            reactotron.reportReduxAction(action, ms, important);
          }

          return result;
        }
      });
    };
  };
});

var reportAction = (function (reactotron, action, ms) {
  var important = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  // let's call the type, name because that's "generic" name in Reactotron
  var name = action.type;

  // convert from symbol to type if necessary

  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'symbol') {
    name = name.toString().replace(/^Symbol\(/, '').replace(/\)$/, '');
  }

  // off ya go!
  reactotron.send('state.action.complete', { name: name, action: action, ms: ms }, important);
});

var createStore$1 = (function (reactotron, rootReducer, preloadedState, enhancer) {
  // shuffle around params if preloadedState is null
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  // wrap the reducer with one which we can replace
  var reducer = reactotron.createReplacementReducer(rootReducer);

  // wrap the enhancer with our beginning and ending one
  var wrappedEnhancer = redux.compose(enhancer, reactotron.createActionTracker());

  // call the redux create store
  var store = redux.createStore(reducer, preloadedState, wrappedEnhancer);

  // remember this store
  reactotron.setReduxStore(store);

  return store;
});

// sends the key names at the given location
var requestKeys = (function (state, reactotron, path) {
  if (RS.isNilOrEmpty(path)) {
    reactotron.stateKeysResponse(null, R__default.keys(state));
  } else {
    var keys = R__default.keys(RS.dotPath(path, state));
    reactotron.stateKeysResponse(path, keys);
  }
});

// sends the values at the given location
var requestValues = (function (state, reactotron, path) {
  if (RS.isNilOrEmpty(path)) {
    // send the whole damn tree
    reactotron.stateValuesResponse(null, state);
  } else {
    // send a leaf of the tree
    reactotron.stateValuesResponse(path, RS.dotPath(path, state));
  }
});

// fishes out the values for the subscriptions in state and returns them
var getSubscriptionValues = (function (subscriptions, state) {
  return R__default.pipe(R__default.filter(RS.endsWith('.*')), R__default.map(function (key) {
    var keyMinusWildcard = R__default.slice(0, -2, key);
    var value = RS.dotPath(keyMinusWildcard, state);
    if (R__default.is(Object, value) && !RS.isNilOrEmpty(value)) {
      return R__default.pipe(R__default.keys, R__default.map(function (key) {
        return keyMinusWildcard + '.' + key;
      }))(value);
    }
    return [];
  }), R__default.concat(subscriptions), R__default.flatten, R__default.reject(RS.endsWith('.*')), R__default.uniq, R__default.sortBy(R__default.identity), R__default.map(function (key) {
    return { path: key, value: RS.dotPath(key, state) };
  }))(subscriptions);
});

var _this = undefined;

// This is the new plugin I'll be promoting to the default export when we hit 2.x
var reactotronRedux = (function () {
  var pluginConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (reactotron) {
    // the one & only redux store --- TODO: find a better way to do this
    var reduxStore = null;

    // which subscribed paths we're current listening to
    var subscriptions = [];

    var sendSubscriptions = function sendSubscriptions() {
      var changes = getSubscriptionValues(subscriptions, reduxStore.getState());
      reactotron.stateValuesChange(changes);
    };

    var sendSubscriptionsIfNeeded = function sendSubscriptionsIfNeeded() {
      var changes = getSubscriptionValues(subscriptions, reduxStore.getState());
      if (!R.isEmpty(changes)) {
        sendSubscriptions();
      }
    };

    // a chance to change the state before backup
    var restoreActionType = pluginConfig.restoreActionType || DEFAULT_REPLACER_TYPE;
    var onBackup = pluginConfig.onBackup || R.identity;
    var onRestore = pluginConfig.onRestore || R.identity;

    return {
      // fires when we receive a command from Reactotron
      onCommand: function onCommand(_ref) {
        var type = _ref.type,
            payload = _ref.payload;

        switch (type) {
          // client is asking for keys
          case 'state.keys.request':
            return requestKeys(reduxStore.getState(), reactotron, payload.path);

          // client is asking for values
          case 'state.values.request':
            return requestValues(reduxStore.getState(), reactotron, payload.path);

          // client is asking to subscribe to some paths
          case 'state.values.subscribe':
            subscriptions = R.pipe(R.flatten, R.uniq)(payload.paths);
            sendSubscriptions();
            return;

          // server is asking to dispatch this action
          case 'state.action.dispatch':
            reduxStore.dispatch(payload.action);
            return;

          // server is asking to backup state
          case 'state.backup.request':
            {
              // run our state through our onBackup
              var state = onBackup(reduxStore.getState());
              reactotron.send('state.backup.response', { state: state });
              return;
            }

          // server is asking to clobber state with this
          case 'state.restore.request':
            {
              // run our state through our onRestore
              var _state = onRestore(payload.state, reduxStore.getState());
              reduxStore.dispatch({ type: restoreActionType, state: _state });
              return;
            }

        }
      },

      // bestow these features on the Reactotron namespace
      features: {
        // a store enhancer which tracks actions for reporting
        createActionTracker: createActionTracker.bind(_this, reactotron, pluginConfig),

        // sends messages thru reactotron about the action
        reportReduxAction: reportAction.bind(_this, reactotron),

        // creates a replacement reducer for uploading new state
        createReplacementReducer: createReplacementReducer,

        // wraps redux's createStore for sane configuration
        createStore: createStore$1.bind(_this, reactotron),

        // sets the current redux store
        setReduxStore: function setReduxStore(store) {
          // remember
          reduxStore = store;

          // subscribe
          store.subscribe(sendSubscriptionsIfNeeded);
        }
      }
    };
  };
});

var RESTORE_ACTION_TYPE = 'REACTOTRON_RESTORE_STATE';
var DEFAULT_ON_BACKUP = function DEFAULT_ON_BACKUP(state) {
  return state;
};
var DEFAULT_ON_RESTORE = function DEFAULT_ON_RESTORE(state) {
  return state;
};

var createPlugin = function createPlugin(store) {
  var pluginConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // the action type we'll trigger restores on
  var restoreActionType = pluginConfig.restoreActionType || RESTORE_ACTION_TYPE;

  // a chance to change the state before backup
  var onBackup = pluginConfig.onBackup || DEFAULT_ON_BACKUP;
  var onRestore = pluginConfig.onRestore || DEFAULT_ON_RESTORE;

  // hold onto the send
  var capturedSend = void 0;

  // which subscribed paths we're current listening to
  var subscriptions = [];

  // here's the plugin
  var plugin = function plugin(reactotron) {
    // remember the plugin's send function for use in the report() below.  :(
    capturedSend = reactotron.send;

    var sendSubscriptions = function sendSubscriptions() {
      var changes = getSubscriptionValues(subscriptions, store.getState());
      reactotron.stateValuesChange(changes);
    };

    var sendSubscriptionsIfNeeded = function sendSubscriptionsIfNeeded() {
      var changes = getSubscriptionValues(subscriptions, store.getState());
      if (!R.isEmpty(changes)) {
        sendSubscriptions();
      }
    };

    store.subscribe(sendSubscriptionsIfNeeded);

    return {

      // fires
      onCommand: function onCommand(_ref) {
        var type = _ref.type,
            payload = _ref.payload;

        switch (type) {
          // client is asking for keys
          case 'state.keys.request':
            return requestKeys(store.getState(), reactotron, payload.path);

          // client is asking for values
          case 'state.values.request':
            return requestValues(store.getState(), reactotron, payload.path);

          // client is asking to subscribe to some paths
          case 'state.values.subscribe':
            subscriptions = R.pipe(R.flatten, R.uniq)(payload.paths);
            sendSubscriptions();
            return;

          // server is asking to dispatch this action
          case 'state.action.dispatch':
            store.dispatch(payload.action);
            return;

          // server is asking to backup state
          case 'state.backup.request':
            {
              // run our state through our onBackup
              var state = onBackup(store.getState());
              reactotron.send('state.backup.response', { state: state });
              return;
            }

          // server is asking to clobber state with this
          case 'state.restore.request':
            {
              // run our state through our onRestore
              var _state = onRestore(payload.state);
              store.dispatch({ type: restoreActionType, state: _state });
              return;
            }

        }
      }
    };
  };

  // attach a function that we can call from the enhancer
  plugin.report = function (action, ms) {
    var important = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!capturedSend) return;

    // let's call the type, name because that's "generic" name in Reactotron
    var name = action.type;

    // convert from symbol to type if necessary

    if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'symbol') {
      name = name.toString().replace(/^Symbol\(/, '').replace(/\)$/, '');
    }

    // off ya go!
    capturedSend('state.action.complete', { name: name, action: action, ms: ms }, important);
  };

  return plugin;
};

var DEFAULTS$1 = {};var createReactotronStoreEnhancer = function createReactotronStoreEnhancer(reactotron) {
  var enhancerOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // verify reactotron
  if (!(R.is(Object, reactotron) && typeof reactotron.use === 'function')) {
    throw new Error('invalid reactotron passed');
  }

  // assemble a crack team of options to use
  var options = R.merge(DEFAULTS$1, enhancerOptions);
  var exceptions = R.concat(['REACTOTRON_RESTORE_STATE'], options.except || []);

  // an enhancer is a function that returns a store
  var reactotronEnhancer = function reactotronEnhancer(createStore$$1) {
    return function (reducer, initialState, enhancer) {
      // the store to create
      var store = createStore$$1(reducer, initialState, enhancer);

      // swizzle the current dispatch
      var originalDispatch = store.dispatch;

      // create our dispatch
      var dispatch = function dispatch(action) {
        // start a timer
        var elapsed = reactotron.startTimer();

        // call the original dispatch that actually does the real work
        var result = originalDispatch(action);

        // stop the timer
        var ms = elapsed();

        // action not blacklisted?
        if (!R.contains(action.type, exceptions)) {
          // check if the app considers this important
          var important = false;
          if (enhancerOptions && typeof enhancerOptions.isActionImportant === 'function') {
            important = !!enhancerOptions.isActionImportant(action);
          }

          plugin.report(action, ms, important);
        }

        // return the real work's result
        return result;
      };
      var newStore = R.merge(store, { dispatch: dispatch.bind(store) });

      // create the plugin with the store & a few passthru options
      var plugin = createPlugin(newStore, {
        onRestore: options.onRestore,
        onBackup: options.onBackup
      });
      reactotron.use(plugin);

      // send the store back, but with our our dispatch
      return newStore;
    };
  };

  return reactotronEnhancer;
};

/* ----------------------------------
   Begin backwards compatibility zone
   ----------------------------------
 */
// This is some goofy stuff to accomodate backwards compat.
// a named version of the store enhancer (for backwards compat)
createReactotronStoreEnhancer.createReactotronStoreEnhancer = createReactotronStoreEnhancer;

// Creates a replacement reducer so we can listen for Reactotron messages
// to clobber the state from the outside.
createReactotronStoreEnhancer.createReplacementReducer = createReplacementReducer;

/* --------------------------------
   End backwards compatibility zone
   --------------------------------
 */

// This is the new plugin support.  Once we get out of the 1.x codebase range,
// we'll upgrade this guy as the default.
createReactotronStoreEnhancer.reactotronRedux = reactotronRedux;

module.exports = createReactotronStoreEnhancer;
