import { Platform, TurboModuleRegistry } from "react-native"
import type { ReactotronCore, Plugin } from "reactotron-core-client"
import type { Spec } from "react-native/Libraries/NativeModules/specs/NativeDevMenu"

const notAvailable = (method: string) => {
  console.warn(`DevMenu.${method}() not available in this environment`)
}

const stubDevMenu: Spec = {
  reload() {
    notAvailable("reload")
  },
  show() {
    notAvailable("show")
  },
  getConstants() {
    return {}
  },
  debugRemotely() {
    notAvailable("debugRemotely")
  },
  setHotLoadingEnabled() {
    notAvailable("setHotLoadingEnabled")
  },
  setProfilingEnabled() {
    notAvailable("setProfilingEnabled")
  },
}

const getDevMenu = (): Spec => {
  if (Platform.OS === "ios" && __DEV__) {
    try {
      const DevMenu = TurboModuleRegistry.get<Spec>("DevMenu")
      if (DevMenu) return DevMenu
      return stubDevMenu
    } catch {
      return stubDevMenu
    }
  }

  return stubDevMenu
}

const devTools = () => () => {
  return {
    onCommand: (command) => {
      if (command.type !== "devtools.open" && command.type !== "devtools.reload") return

      if (command.type === "devtools.open") {
        const DevMenu = getDevMenu()
        DevMenu.show()
      }

      if (command.type === "devtools.reload") {
        const DevMenu = getDevMenu()
        DevMenu.reload()
      }
    },
  } satisfies Plugin<ReactotronCore>
}

export default devTools
