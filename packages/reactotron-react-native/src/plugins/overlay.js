import React from 'react'
import { View } from 'react-native'
import FullScreenOverlay from './full-screen-overlay'
import mitt from '../mitt'

/**
 * Provides an image.
 */
export default () => reactotron => {
  const emitter = mitt()

  return {
    /**
     * Fires when any Reactotron message arrives.
     *
     * @param {object} command The Reactotron command object.
     */
    onCommand: command => {
      if (command.type !== 'overlay') return
      // relay this payload on to the emitter
      emitter.emit('overlay', command.payload)
    },

    features: {
      overlay: WrappedComponent => props => (
        <View style={{ flex: 1 }}>
          <WrappedComponent />
          <FullScreenOverlay emitter={emitter} />
        </View>
      )
    }
  }
}
