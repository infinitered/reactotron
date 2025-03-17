declare module "react-native/Libraries/NativeModules/specs/NativeDevMenu" {
  import type { TurboModule } from "react-native"
  /**
   * @see https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/NativeModules/specs/NativeDevMenu.js
   * @see https://github.com/facebook/react-native/blob/main/packages/react-native/src/private/specs/modules/NativeDevMenu.js#L15-L21
   */
  export interface Spec extends TurboModule {
    show: () => void
    reload: () => void
    debugRemotely: (enableDebug: boolean) => void
    setProfilingEnabled: (enabled: boolean) => void
    setHotLoadingEnabled: (enabled: boolean) => void
  }

  const DevMenu: Spec
  export default DevMenu
}
