import { Platform, TurboModuleRegistry } from "react-native"
import type { ReactotronCore, Plugin } from "reactotron-core-client"
import type { Spec } from "react-native/Libraries/NativeModules/specs/NativeDevMenu"

/**
 * Lazily get the DevMenu module.
 *
 * This avoids trying a potentially risky call to React Native internals unless our dear developer actually wants to use it.
 */
const getDevMenu = (): Spec => {
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

  if (Platform.OS === "ios" && __DEV__) {
    try {
      // use TurboModuleRegistry.get instead of TurboModuleRegistry.getEnforcing, like at
      // https://github.com/facebook/react-native/blob/main/packages/react-native/src/private/specs/modules/NativeDevMenu.js#L23
      const DevMenu = TurboModuleRegistry.get<Spec>("DevMenu")
      // the DevMenu module is not available in all environments, like Expo Go, so we need to check if it exists
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
