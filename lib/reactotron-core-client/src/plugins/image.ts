import type { ReactotronCore, Plugin } from "../reactotron-core-client"

interface ImagePayload {
  uri: string
  preview: string
  caption?: string
  width?: number
  height?: number
  filename?: string
}

/**
 * Provides an image.
 */
const image = () => (reactotron: ReactotronCore) => {
  return {
    features: {
      // expanded just to show the specs
      image: ({ uri, preview, filename, width, height, caption }: ImagePayload) =>
        reactotron.send("image", { uri, preview, filename, width, height, caption }),
    },
  } satisfies Plugin<ReactotronCore>
}

export default image
