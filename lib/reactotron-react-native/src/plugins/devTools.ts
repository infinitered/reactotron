import { TurboModuleRegistry } from "react-native"
import type { ReactotronCore, Plugin } from "reactotron-core-client"
// eslint-disable-next-line
import DevMenuSpec from "react-native/src/private/specs/modules/NativeDevMenu"

const devTools = () => () => {
  const DevMenu = TurboModuleRegistry.getEnforcing<DevMenuSpec>("DevMenu").show()
  return {
    onCommand: (command) => {
      if (command.type !== "devtools.open" && command.type !== "devtools.reload") return

      if (command.type === "devtools.open") {
        DevMenu.show()
      }

      if (command.type === "devtools.reload") {
        DevMenu.reload()
      }
    },
  } satisfies Plugin<ReactotronCore>
}

export default devTools
