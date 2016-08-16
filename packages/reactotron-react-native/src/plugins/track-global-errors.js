/**
 * Provides a global error handler to report errors..
 */
import { merge, map, reject, contains } from 'ramda'
import { NativeModules } from 'react-native'

// defaults
const PLUGIN_DEFAULTS = {
  veto: null // frame -> boolean
}

// const reactNativeFrameFinder = frame => contains('/node_modules/react-native/', frame.fileName)

// our plugin entry point
export default options => reactotron => {
  // setup configuration
  const config = merge(PLUGIN_DEFAULTS, options || {})

  let swizzled = null
  let isSwizzled = false

  function reactotronExceptionHijacker (message, prettyStack, currentExceptionID) {
    // do Facebook's stuff first
    swizzled(message, prettyStack, currentExceptionID)

    // then convert & transport it
    try {
      // rewrite the stack frames to be in the format we're expecting
      let stack = map(frame => ({
        functionName: frame.methodName === '<unknown>' ? null : frame.methodName,
        lineNumber: frame.lineNumber,
        columnNumber: frame.column,
        fileName: frame.file
      }), prettyStack)

      // does the dev want us to keep each frame?
      if (config.veto) {
        stack = reject(config.veto, stack)
      }

      // throw it over to us
      reactotron.error(message, stack)
    } catch (e) {
      // TODO: no one must ever know our dark secrets
    }
  }

  // here's how to swizzle
  function trackGlobalErrors () {
    if (isSwizzled) return
    swizzled = NativeModules.ExceptionsManager.updateExceptionMessage
    NativeModules.ExceptionsManager.updateExceptionMessage = reactotronExceptionHijacker
    isSwizzled = true
  }

  // restore the original
  function untrackGlobalErrors () {
    if (!swizzled) return
    NativeModules.ExceptionsManager.updateExceptionMessage = swizzled
    isSwizzled = false
  }

  // auto start this
  trackGlobalErrors()

  // the reactotron plugin interface
  return {
    // attach these functions to the Reactotron
    features: {
      trackGlobalErrors,
      untrackGlobalErrors
    }
  }
}
