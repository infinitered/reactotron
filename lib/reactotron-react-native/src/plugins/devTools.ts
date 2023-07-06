import type { ReactotronCore, Plugin } from "reactotron-core-client"
import { NativeModules } from "react-native"

const devTools = () => () => {
  return {
    onCommand: (command) => {
      if (command.type !== "devtools.open" && command.type !== "devtools.reload") return

      if (command.type === "devtools.open") {
        NativeModules.DevMenu.show()
      }

      if (command.type === "devtools.reload") {
        NativeModules.DevMenu.reload()
      }
    },
  } satisfies Plugin<ReactotronCore>
}

export default devTools
