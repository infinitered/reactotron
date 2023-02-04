import type { ReactotronCore, Plugin } from "../reactotron-core-client"

/**
 * Clears the reactotron server.
 */
export default () => (reactotron: ReactotronCore) => {
  return {
    features: {
      clear: () => reactotron.send("clear"),
    },
  } satisfies Plugin<ReactotronCore>
}
