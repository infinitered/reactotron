import React from "react"
import mitt from "mitt"

import StorybookSwitcher from "./storybook"

/**
 * A plugin which provides .storybookSwitcher() on Reactotron.
 */
export default () => () => {
  const emitter = mitt()

  return {
    onCommand: (command: any) => {
      if (command.type !== "storybook") return
      // relay this payload on to the emitter
      emitter.emit("storybook", command.payload)
    },

    features: {
      storybookSwitcher: (storybookUi: any) => (WrappedComponent: any) =>
        function StorybookSwitcherContainer(props: any) {
          return (
            <StorybookSwitcher storybookUi={storybookUi} emitter={emitter}>
              <WrappedComponent {...props} />
            </StorybookSwitcher>
          )
        },
    },
  }
}
