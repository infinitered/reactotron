import React from "react"
import { View } from "react-native"
import mitt from "mitt"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

import FullScreenOverlay from "./overlay"

export default function OverlayCreator() {
  return function overlay() {
    const emitter = mitt()

    return {
      /**
       * Fires when any Reactotron message arrives.
       */
      onCommand: (command) => {
        if (command.type !== "overlay") return
        // relay this payload on to the emitter
        emitter.emit("overlay", command.payload)
      },

      features: {
        overlay:
          (WrappedComponent: React.ComponentType) =>
          (props: Record<string, any> = {}) =>
            (
              <View style={{ flex: 1 }}>
                <WrappedComponent {...props} />
                <FullScreenOverlay emitter={emitter} />
              </View>
            ),
      },
    } satisfies Plugin<ReactotronCore>
  }
}

export type OverlayFeatures = ReturnType<ReturnType<typeof OverlayCreator>>["features"]
