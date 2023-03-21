/**
 * Provides a global error handler to report errors with sourcemap lookup.
 */
import StackTrace from "stacktrace-js"

// what to say whe we can't resolve source maps
const CANNOT_RESOLVE_ERROR =
  'Unable to resolve error.  Either support CORS by changing webpack\'s devtool to "source-map" or run in offline mode.'

// defaults
const PLUGIN_DEFAULTS = {
  offline: false, // true = don't do source maps lookup cross domain
}

// our plugin entry point
export default (options) => (reactotron) => {
  // setup configuration
  const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})

  // holds the previous window.onerror when needed
  let swizzledOnError = null
  let isSwizzled = false

  // the functionality of our window.onerror.
  // we could have used window.addEventListener("error", ...) but that doesn't work on all browsers
  function windowOnError(msg, file, line, col, error) {
    // resolve the stack trace
    StackTrace.fromError(error, { offline: config.offline })
      // then try to send it up to the server
      .then((stackFrames) => reactotron.error(msg, stackFrames))
      // can't resolve, well, let the user know, but still upload something sane
      .catch((resolvingError) =>
        reactotron.error({
          message: CANNOT_RESOLVE_ERROR,
          original: { msg, file, line, col, error },
          resolvingError,
        })
      )

    // call back the previous window.onerror if we have one
    if (swizzledOnError) {
      swizzledOnError(msg, file, line, col, error)
    }
  }

  // swizzles window.onerror dropping in our new one
  function trackGlobalErrors() {
    if (isSwizzled) return
    swizzledOnError = window.onerror
    window.onerror = windowOnError
    isSwizzled = true
  }

  // restore the original
  function untrackGlobalErrors() {
    if (!swizzledOnError) return
    window.onerror = swizzledOnError
    isSwizzled = false
  }

  // auto start this
  trackGlobalErrors()

  // the reactotron plugin interface
  return {
    // attach these functions to the Reactotron
    features: {
      trackGlobalErrors,
      untrackGlobalErrors,
    },
  }
}
