import createSagaMonitor from './saga-monitor'

// Behold!  The entry point of our plugin
export default pluginConfig => reactotron => ({
  // make these functions available on the Reactotron
  features: {
    // spawn a saga monitor with the given options
    createSagaMonitor: options => createSagaMonitor(reactotron, options)
  }
})
