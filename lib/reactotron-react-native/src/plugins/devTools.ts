import { NativeModules } from "react-native"

export default () => () => {
  return {
    onCommand: (command: any) => {
      if (command.type !== "devtools.open" && command.type !== "devtools.reload") return

      if (command.type === "devtools.open") {
        NativeModules.DevMenu.show()
      }

      if (command.type === "devtools.reload") {
        NativeModules.DevMenu.reload()
      }
    },
  }
}
