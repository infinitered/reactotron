'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactotronCoreClient = require('reactotron-core-client');
var io = _interopDefault(require('socket.io-client'));
var StackTrace = _interopDefault(require('stacktrace-js'));
var ramda = require('ramda');

/**
 * Provides a global error handler to report errors with sourcemap lookup.
 */
// what to say whe we can't resolve source maps
var CANNOT_RESOLVE_ERROR = 'Unable to resolve error.  Either support CORS by changing webpack\'s devtool to "source-maps" or run in offline mode.';

// defaults
var PLUGIN_DEFAULTS = {
  offline: false // true = don't do source maps lookup cross domain
};

// our plugin entry point
var trackGlobalErrors = (function (options) {
  return function (reactotron) {
    // setup configuration
    var config = ramda.merge(PLUGIN_DEFAULTS, options || {});

    // holds the previous window.onerror when needed
    var swizzledOnError = null;
    var isSwizzled = false;

    // the functionality of our window.onerror.
    // we could have used window.addEventListener("error", ...) but that doesn't work on all browsers
    function windowOnError(msg, file, line, col, error) {
      // resolve the stack trace
      StackTrace.fromError(error, { offline: config.offline })
      // then try to send it up to the server
      .then(function (stackFrames) {
        return reactotron.error(msg, stackFrames);
      })
      // can't resolve, well, let the user know, but still upload something sane
      .catch(function (resolvingError) {
        return reactotron.error({
          message: CANNOT_RESOLVE_ERROR,
          original: { msg: msg, file: file, line: line, col: col, error: error },
          resolvingError: resolvingError
        });
      });

      // call back the previous window.onerror if we have one
      if (swizzledOnError) {
        swizzledOnError(msg, file, line, col, error);
      }
    }

    // swizzles window.onerror dropping in our new one
    function trackGlobalErrors() {
      if (isSwizzled) return;
      swizzledOnError = window.onerror;
      window.onerror = windowOnError;
      isSwizzled = true;
    }

    // restore the original
    function untrackGlobalErrors() {
      if (!swizzledOnError) return;
      window.onerror = swizzledOnError;
      isSwizzled = false;
    }

    // auto start this
    trackGlobalErrors();

    // the reactotron plugin interface
    return {
      // attach these functions to the Reactotron
      features: {
        trackGlobalErrors: trackGlobalErrors,
        untrackGlobalErrors: untrackGlobalErrors
      }
    };
  };
});

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

var DEFAULTS = {
  io: io,
  host: 'localhost',
  port: 9090,
  name: 'React JS App',
  userAgent: window.navigator.userAgent,
  reactotronVersion: 'BETA' // TODO: figure this out for realz.  why is this hard?  it must be me.
};

// -----------
// HERE WE GO!
// -----------
// Create the default reactotron.
var index = reactotronCoreClient.createClient(DEFAULTS);

exports.trackGlobalErrors = trackGlobalErrors;
exports['default'] = index;
