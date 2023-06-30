/**
 * Provides a global error handler to report errors..
 */
import { NativeModules } from "react-native"
import { Reactotron, ReactotronCore } from "reactotron-core-client"
import {
  LogBox as _LogBox,
  LogBoxStatic as LogBoxStaticPublic,
  // eslint-disable-next-line import/default, import/namespace
} from "react-native/Libraries/LogBox/LogBox"
// eslint-disable-next-line import/namespace
import type { ExtendedExceptionData } from "react-native/Libraries/LogBox/Data/parseLogBoxLog"

interface LogboxStaticPrivate extends LogBoxStaticPublic {
  /**
   * @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/LogBox/LogBox.js#L29
   */
  addException: (error: ExtendedExceptionData) => void
}

const LogBox = _LogBox as unknown as LogboxStaticPrivate

// a few functions to help source map errors -- these seem to be not available immediately
// so we're lazy loading.
let parseErrorStack: typeof import("react-native/Libraries/Core/Devtools/parseErrorStack").default
let symbolicateStackTrace: typeof import("react-native/Libraries/Core/Devtools/symbolicateStackTrace").default

export interface TrackGlobalErrorsOptions {
  veto?: (frame: any) => boolean
}

// defaults
const PLUGIN_DEFAULTS: TrackGlobalErrorsOptions = {
  veto: null,
}

// const reactNativeFrameFinder = frame => contains('/node_modules/react-native/', frame.fileName)

// our plugin entry point
export default <ReactotronSubtype = ReactotronCore>(options: TrackGlobalErrorsOptions) =>
  (reactotron: Reactotron<ReactotronSubtype> & ReactotronSubtype) => {
    // setup configuration
    const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})

    let swizzled = null
    let isSwizzled = false

    function reactotronExceptionHijacker(message, prettyStack, currentExceptionID) {
      // do Facebook's stuff first
      swizzled(message, prettyStack, currentExceptionID)

      // then convert & transport it
      try {
        // rewrite the stack frames to be in the format we're expecting
        let stack = prettyStack.map((frame) => ({
          functionName: frame.methodName === "<unknown>" ? null : frame.methodName,
          lineNumber: frame.lineNumber,
          columnNumber: frame.column,
          fileName: frame.file,
        }))

        // does the dev want us to keep each frame?
        if (config.veto) {
          stack = stack.filter((frame) => config.veto(frame))
        }

        // throw it over to us
        ;(reactotron as any).error(message, stack) // TODO: Fix this.
      } catch (e) {
        // TODO: no one must ever know our dark secrets
      }
    }

    // here's how to swizzle
    function trackGlobalErrors() {
      if (isSwizzled) return
      if (!NativeModules.ExceptionsManager) return
      swizzled = NativeModules.ExceptionsManager.updateExceptionMessage
      NativeModules.ExceptionsManager.updateExceptionMessage = reactotronExceptionHijacker
      isSwizzled = true
    }

    // restore the original
    function untrackGlobalErrors() {
      if (!swizzled) return
      if (!NativeModules.ExceptionsManager) return
      NativeModules.ExceptionsManager.updateExceptionMessage = swizzled
      isSwizzled = false
    }

    // manually fire an error
    function reportError(error: Parameters<typeof LogBox.addException>[0]) {
      try {
        parseErrorStack =
          parseErrorStack || require("react-native/Libraries/Core/Devtools/parseErrorStack")
        symbolicateStackTrace =
          symbolicateStackTrace ||
          require("react-native/Libraries/Core/Devtools/symbolicateStackTrace")
        if (parseErrorStack && symbolicateStackTrace) {
          // @ts-expect-error parseErrorStack arg type is wrong, it's expecting an array, a string, or a hermes error data, https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/Devtools/parseErrorStack.js#L41
          const parsedStacktrace = parseErrorStack(error.stack)
          symbolicateStackTrace(parsedStacktrace).then(function (stackFrames) {
            let prettyStackFrames = stackFrames.map(function (stackFrame) {
              return {
                fileName: stackFrame.file,
                functionName: stackFrame.methodName,
                lineNumber: stackFrame.lineNumber,
              }
            })

            // does the dev want us to keep each frame?
            if (config.veto) {
              prettyStackFrames = prettyStackFrames.filter(function (frame) {
                return config.veto(frame)
              })
            }
            reactotron.error(error.message, prettyStackFrames) // TODO: Fix this.
          })
        }
      } catch (e) {
        // nothing happened. move along.
      }
    }

    // the reactotron plugin interface
    return {
      onConnect: () => {
        LogBox.addException = new Proxy(LogBox.addException, {
          apply: function (target, thisArg, argumentsList: Parameters<typeof LogBox.addException>) {
            const error = argumentsList[0]
            reportError(error)
            return target.apply(thisArg, argumentsList)
          },
        })
      },

      // attach these functions to the Reactotron
      features: {
        reportError,
        trackGlobalErrors,
        untrackGlobalErrors,
      },
    }
  }
