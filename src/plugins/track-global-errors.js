/**
 * Provides a global error handler to report errors..
 */
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
  const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})

  let swizzled = null
  let isSwizzled = false

  function reactotronExceptionHijacker (message, prettyStack, currentExceptionID) {
    // do Facebook's stuff first
    swizzled(message, prettyStack, currentExceptionID)

    // then convert & transport it
    try {
      // rewrite the stack frames to be in the format we're expecting
      let stack = prettyStack.map(
        frame => ({
          functionName: frame.methodName === '<unknown>' ? null : frame.methodName,
          lineNumber: frame.lineNumber,
          columnNumber: frame.column,
          fileName: frame.file
        })
      )

      // does the dev want us to keep each frame?
      if (config.veto) {
        stack = stack.filter(frame => config.veto(frame))
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
    if (!NativeModules.ExceptionsManager) return
    swizzled = NativeModules.ExceptionsManager.updateExceptionMessage
    NativeModules.ExceptionsManager.updateExceptionMessage = reactotronExceptionHijacker
    isSwizzled = true
  }

  // restore the original
  function untrackGlobalErrors () {
    if (!swizzled) return
    if (!NativeModules.ExceptionsManager) return
    NativeModules.ExceptionsManager.updateExceptionMessage = swizzled
    isSwizzled = false
  }

  // auto start this
  trackGlobalErrors()

  // manually fire an error
  function reportError (error) {
    try {
      parseErrorStack =
        parseErrorStack || require('react-native/Libraries/Core/Devtools/parseErrorStack')
      symbolicateStackTrace =
        symbolicateStackTrace ||
        require('react-native/Libraries/Core/Devtools/symbolicateStackTrace')
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
            stack = stack.filter(frame => config.veto(frame))
          }

          reactotron.error(error.message, stack)
        })
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
