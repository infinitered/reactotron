import React from "react"
import mitt from "mitt"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

import StorybookSwitcher from "./storybook"

/**
 * A plugin which provides .storybookSwitcher() on Reactotron.
 */
export default () => () => {
  const emitter = mitt()

  return {
    onCommand: (command) => {
      if (command.type !== "storybook") return
      // relay this payload on to the emitter
      emitter.emit("storybook", command.payload)
    },

    features: {
      storybookSwitcher:
        (storybookUi: StorybookSwitcher["props"]["storybookUi"]) =>
        (WrappedComponent: React.ComponentType<any>) =>
          function StorybookSwitcherContainer(props: any) {
            return (
              <StorybookSwitcher storybookUi={storybookUi} emitter={emitter}>
                <WrappedComponent {...props} />
              </StorybookSwitcher>
            )
          },
    },
  } satisfies Plugin<ReactotronCore>
}
