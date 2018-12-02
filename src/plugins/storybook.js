import React from 'react'
import StorybookSwitcher from './storybook-switcher'
import mitt from 'mitt'

/**
 * A plugin which provides .storybookSwitcher() on Reactotron.
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
      if (command.type !== 'storybook') return
      // relay this payload on to the emitter
      emitter.emit('storybook', command.payload)
    },

    features: {
      storybookSwitcher: storybookUi => WrappedComponent => props => (
        <StorybookSwitcher storybookUi={storybookUi} emitter={emitter}>
          <WrappedComponent {...props} />
        </StorybookSwitcher>
      )
    }
  }
}
