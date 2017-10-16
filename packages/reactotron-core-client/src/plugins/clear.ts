/**
 * Clears the reactotron server.
 */
export default () => reactotron => {
  return {
    features: {
      clear: () => reactotron.send('clear'),
    },
  }
}
