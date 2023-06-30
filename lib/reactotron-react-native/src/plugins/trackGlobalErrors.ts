/**
 * Provides a global error handler to report errors..
 */
import { Reactotron, ReactotronCore } from "reactotron-core-client"
import {
  LogBox as _LogBox,
  LogBoxStatic as LogBoxStaticPublic,
  // eslint-disable-next-line import/default, import/namespace
} from "react-native/Libraries/LogBox/LogBox"
// eslint-disable-next-line import/namespace
import type { ExtendedExceptionData } from "react-native/Libraries/LogBox/Data/parseLogBoxLog"

interface LogBoxStaticPrivate extends LogBoxStaticPublic {
  /**
   * @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/LogBox/LogBox.js#L29
   */
  addException: (error: ExtendedExceptionData) => void
}

const LogBox = _LogBox as unknown as LogBoxStaticPrivate

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
      },
    }
  }
