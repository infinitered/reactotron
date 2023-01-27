import type { Reactotron } from "../reactotron-core-client"

/**
 * Provides an image.
 */
export default () => (reactotron: Reactotron) => {
  return {
    features: {
      // expanded just to show the specs
      image: ({ uri, preview, filename, width, height, caption }) =>
        reactotron.send("image", { uri, preview, filename, width, height, caption }),
    },
  }
}
