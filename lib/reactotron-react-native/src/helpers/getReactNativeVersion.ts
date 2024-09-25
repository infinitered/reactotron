/* eslint-disable */
import PlatformConstantsIOSSpec from "react-native/src/private/specs/modules/NativePlatformConstantsIOS"
import PlatformConstantsAndroidSpec from "react-native/src/private/specs/modules/NativePlatformConstantsAndroid"
/* eslint-enable */
import { getReactNativeVersionWithModules } from "./getReactNativeVersionWithModules"
import { TurboModuleRegistry } from "react-native"

export default function getReactNativeVersion(): string | null {
  const constants =
    TurboModuleRegistry.getEnforcing<PlatformConstantsIOSSpec | PlatformConstantsAndroidSpec>(
      "PlatformConstants"
    ).getConstants() || {}
  return getReactNativeVersionWithModules(constants)
}
