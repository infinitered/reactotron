/**
 * Provides 4 features for logging.  log & debug are the same.
 */
export default () => reactotron => {
  return {
    features: {
      log: (message, important = false) =>
        reactotron.send(
          'log',
          { level: 'debug', message: message || null },
          !!important
        ),
      debug: (message, important = false) =>
        reactotron.send(
          'log',
          { level: 'debug', message: message || null },
          !!important
        ),
      warn: message =>
        reactotron.send(
          'log',
          { level: 'warn', message: message || null },
          true
        ),
      error: (message, stack) =>
        reactotron.send(
          'log',
          { level: 'error', message: message || null, stack: stack || null },
          true
        )
    }
  }
}
