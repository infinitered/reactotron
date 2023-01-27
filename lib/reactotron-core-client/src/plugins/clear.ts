import type { Reactotron } from "../reactotron-core-client"

/**
 * Clears the reactotron server.
 */
export default () => (reactotron: Reactotron) => {
  return {
    features: {
      clear: () => reactotron.send("clear"),
    },
  }
}
