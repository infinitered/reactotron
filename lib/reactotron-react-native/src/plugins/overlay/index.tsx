import React from "react"
import { View } from "react-native"
import mitt from "mitt"

import FullScreenOverlay from "./overlay"

export default () => () => {
  const emitter = mitt()

  return {
    /**
     * Fires when any Reactotron message arrives.
     *
     * @param {object} command The Reactotron command object.
     */
    onCommand: (command) => {
      if (command.type !== "overlay") return
      // relay this payload on to the emitter
      emitter.emit("overlay", command.payload)
    },

    features: {
      overlay: (WrappedComponent: any) => (props) =>
        (
          <View style={{ flex: 1 }}>
            <WrappedComponent {...props} />
            <FullScreenOverlay emitter={emitter} />
          </View>
        ),
    },
  }
}
