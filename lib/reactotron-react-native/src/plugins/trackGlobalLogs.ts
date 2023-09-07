import {
  InferFeatures,
  LoggerPlugin,
  ReactotronCore,
  assertHasLoggerPlugin,
  Plugin,
} from "reactotron-core-client"

/**
 * Track calls to console.log, console.warn, and console.debug and send them to Reactotron logger
 */
const trackGlobalLogs = () => (reactotron: ReactotronCore) => {
  assertHasLoggerPlugin(reactotron)
  const client = reactotron as ReactotronCore & InferFeatures<ReactotronCore, LoggerPlugin>

  return {
    onConnect: () => {
      const originalConsoleLog = console.log
      console.log = (...args: Parameters<typeof console.log>) => {
        originalConsoleLog(...args)
        client.log(...args)
      }

      const originalConsoleWarn = console.warn
      console.warn = (...args: Parameters<typeof console.warn>) => {
        originalConsoleWarn(...args)
        client.warn(args[0])
      }

      const originalConsoleDebug = console.debug
      console.debug = (...args: Parameters<typeof console.debug>) => {
        originalConsoleDebug(...args)
        client.debug(args[0])
      }

      // console.error is taken care of by ./trackGlobalErrors.ts
    },
  } satisfies Plugin<ReactotronCore>
}

export default trackGlobalLogs
