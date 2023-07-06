import type { ReactotronCore, Plugin } from "../reactotron-core-client"

/**
 * Clears the reactotron server.
 */
const clear = () => (reactotron: ReactotronCore) => {
  return {
    features: {
      clear: () => reactotron.send("clear"),
    },
  } satisfies Plugin<ReactotronCore>
}

export default clear
