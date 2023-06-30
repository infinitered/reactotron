/**
 * Provides a global error handler to report errors..
 */
import { Reactotron, ReactotronCore } from "reactotron-core-client"
import _LogBox, {
  LogBoxStatic as LogBoxStaticPublic,
  // eslint-disable-next-line import/default, import/namespace
} from "react-native/Libraries/LogBox/LogBox"
// eslint-disable-next-line import/namespace
import type { ExtendedExceptionData } from "react-native/Libraries/LogBox/Data/parseLogBoxLog"
import type { SymbolicateStackTraceFn } from "../helpers/symbolicateStackTrace"
import type { ParseErrorStackFn } from "../helpers/parseErrorStack"

interface LogBoxStaticPrivate extends LogBoxStaticPublic {
  /**
   * @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/LogBox/LogBox.js#L29
   */
  addException: (error: ExtendedExceptionData) => void
}

const LogBox = _LogBox as unknown as LogBoxStaticPrivate

// a few functions to help source map errors -- these seem to be not available immediately
// so we're lazy loading.
let parseErrorStack: ParseErrorStackFn
let symbolicateStackTrace: SymbolicateStackTraceFn

export interface ErrorStackFrame {
  fileName: string
  functionName: string
  lineNumber: number
  columnNumber?: number | null
}

export interface TrackGlobalErrorsOptions {
  veto?: (frame: ErrorStackFrame) => boolean
}

// defaults
const PLUGIN_DEFAULTS: TrackGlobalErrorsOptions = {
  veto: null,
}

const objectifyError = (error: Error) => {
  const objectifiedError = {} as Record<string, unknown>
  Object.getOwnPropertyNames(error).forEach((key) => {
    objectifiedError[key] = error[key]
  })
  return objectifiedError
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
      } catch (e) {
        reactotron.error(
          'Unable to load "react-native/Libraries/Core/Devtools/parseErrorStack" or "react-native/Libraries/Core/Devtools/symbolicateStackTrace"',
          []
        )
        reactotron.debug(objectifyError(e))
        return
      }

      if (!parseErrorStack || !symbolicateStackTrace) {
        return
      }

      let parsedStacktrace: ReturnType<typeof parseErrorStack>

      try {
        // parseErrorStack arg type is wrong, it's expecting an array, a string, or a hermes error data, https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/Devtools/parseErrorStack.js#L41
        parsedStacktrace = parseErrorStack(error.stack)
      } catch (e) {
        reactotron.error("Unable to parse stack trace from error object", [])
        reactotron.debug(objectifyError(e))
        return
      }

      symbolicateStackTrace(parsedStacktrace)
        .then((symbolicatedStackTrace) => {
          let prettyStackFrames = symbolicatedStackTrace.stack.map((stackFrame) => ({
            fileName: stackFrame.file,
            functionName: stackFrame.methodName,
            lineNumber: stackFrame.lineNumber,
          }))
          // does the dev want us to keep each frame?
          if (config.veto) {
            prettyStackFrames = prettyStackFrames.filter((frame) => config?.veto(frame))
          }
          reactotron.error(error.message, prettyStackFrames) // TODO: Fix this.
        })
        .catch((e) => {
          reactotron.error("Unable to symbolicate stack trace from error object", [])
          reactotron.debug(objectifyError(e))
        })
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
