/**
 * Provides a global error handler to report errors..
 */
import { merge, map, reject } from 'ramda'
import { NativeModules } from 'react-native'

// a few functions to help source map errors -- these seem to be not available immediately
// so we're lazy loading.
let parseErrorStack
let symbolicateStackTrace

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

  // manually fire an error
  function reportError (error) {
    try {
      parseErrorStack = parseErrorStack || require('react-native/Libraries/Core/Devtools/parseErrorStack')
      symbolicateStackTrace = symbolicateStackTrace || require('react-native/Libraries/Core/Devtools/symbolicateStackTrace')
      if (parseErrorStack && symbolicateStackTrace) {
        const parsedStacktrace = parseErrorStack(error)

        symbolicateStackTrace(parsedStacktrace).then(goodStack => {
          let stack = goodStack.map(stackFrame => ({
            fileName: stackFrame.file,
            functionName: stackFrame.methodName,
            lineNumber: stackFrame.lineNumber
          }))

          // does the dev want us to keep each frame?
          if (config.veto) {
            stack = reject(config.veto, stack)
          }

          reactotron.error(error.message, stack)
        })

        return
      }
    } catch (e) {
      // nothing happened. move along.
    }
  }

  // the reactotron plugin interface
  return {
    // attach these functions to the Reactotron
    features: {
      reportError,
      trackGlobalErrors,
      untrackGlobalErrors
    }
  }
}
