/**
 * Provides 4 features for logging.  log & debug are the same.
 */
export default (send) => {
  return {
    features: {
      log: (message) => send('log', { level: 'debug', message }),
      debug: (message) => send('log', { level: 'debug', message }),
      warn: (message) => send('log', { level: 'warn', message }),
      error: (message) => send('log', { level: 'error', message })
    }
  }
}
