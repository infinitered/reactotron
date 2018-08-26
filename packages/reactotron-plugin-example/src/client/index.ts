export default pluginConfig => reactotron => ({
    features: {
      aTestPlugin: () => reactotron.send("example.test", { timestamp: new Date() })
    }
  })
