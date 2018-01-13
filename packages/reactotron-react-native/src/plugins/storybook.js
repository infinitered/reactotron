import React from 'react'
import { View } from 'react-native'
import StorybookSwitcher from './storybook-switcher'
import mitt from 'mitt'

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
      if (command.type !== 'custom') return
      // relay this payload on to the emitter
      const splitCommand = command.payload.split(':')
      if (splitCommand[0].toLowerCase() !== 'storybook') return
      emitter.emit('storybook', splitCommand[1].toLowerCase() === 'true')
    },

    features: {
      storybookSwitcher: storybookUi => WrappedComponent => props => (
        <StorybookSwitcher
          storybookUi={storybookUi}
          emitter={emitter}
        >
          <WrappedComponent {...props} />
        </StorybookSwitcher>
      )
    }
  }
}
