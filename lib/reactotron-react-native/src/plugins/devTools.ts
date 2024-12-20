import { Platform } from "react-native"
import type { ReactotronCore, Plugin } from "reactotron-core-client"

let DevMenu = { show: () => {}, reload: () => {} }
if (Platform.OS === "ios" && __DEV__) {
  DevMenu = require("react-native/Libraries/NativeModules/specs/NativeDevMenu")
}

const devTools = () => () => {
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
