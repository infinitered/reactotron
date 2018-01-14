/**
 * Provides 4 features for logging.  log & debug are the same.
 */
export default () => reactotron => {
  return {
    features: {
      log: (message, important = false) =>
        reactotron.send("log", { level: "debug", message }, !!important),
      debug: (message, important = false) =>
        reactotron.send("log", { level: "debug", message }, !!important),
      warn: message => reactotron.send("log", { level: "warn", message }, true),
      error: (message, stack) => reactotron.send("log", { level: "error", message, stack }, true),
    },
  }
}
