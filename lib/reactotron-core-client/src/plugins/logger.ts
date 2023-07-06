import type { ReactotronCore, Plugin, InferFeatures } from "../reactotron-core-client"

/**
 * Provides 4 features for logging.  log & debug are the same.
 */
const logger = () => (reactotron: ReactotronCore) => {
  return {
    features: {
      log: (...args) => {
        const content = args && args.length === 1 ? args[0] : args
        reactotron.send("log", { level: "debug", message: content }, false)
      },
      logImportant: (...args) => {
        const content = args && args.length === 1 ? args[0] : args
        reactotron.send("log", { level: "debug", message: content }, true)
      },
      debug: (message, important = false) =>
        reactotron.send("log", { level: "debug", message }, !!important),
      warn: (message) => reactotron.send("log", { level: "warn", message }, true),
      error: (message, stack) => reactotron.send("log", { level: "error", message, stack }, true),
    },
  } satisfies Plugin<ReactotronCore>
}

export default logger

export type LoggerPlugin = ReturnType<typeof logger>

export const hasLoggerPlugin = (
  reactotron: ReactotronCore
): reactotron is ReactotronCore & InferFeatures<ReactotronCore, ReturnType<typeof logger>> => {
  return (
    reactotron &&
    "log" in reactotron &&
    typeof reactotron.log === "function" &&
    "logImportant" in reactotron &&
    typeof reactotron.logImportant === "function" &&
    "debug" in reactotron &&
    typeof reactotron.debug === "function" &&
    "warn" in reactotron &&
    typeof reactotron.warn === "function" &&
    "error" in reactotron &&
    typeof reactotron.error === "function"
  )
}

export const assertHasLoggerPlugin = (
  reactotron: ReactotronCore
): asserts reactotron is ReactotronCore &
  InferFeatures<ReactotronCore, ReturnType<typeof logger>> => {
  if (!hasLoggerPlugin(reactotron)) {
    throw new Error(
      "This Reactotron client has not had the logger plugin applied to it. Make sure that you add `use(logger())` before adding this plugin."
    )
  }
}
