import type { ReactotronCore, Plugin } from "../reactotron-core-client"

/**
 * Provides 4 features for logging.  log & debug are the same.
 */
export default () => (reactotron: ReactotronCore) => {
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
