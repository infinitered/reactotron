/**
 * Provides 4 features for logging.  log & debug are the same.
 */
export default (reactotron) => {
  return {
    features: {
      log: (message) => reactotron.send('log', { level: 'debug', message }),
      debug: (message) => reactotron.send('log', { level: 'debug', message }),
      warn: (message) => reactotron.send('log', { level: 'warn', message }),
      error: (message) => reactotron.send('log', { level: 'error', message })
    }
  }
}
