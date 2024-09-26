import { Platform, PlatformIOSStatic, PlatformAndroidStatic } from "react-native"

export default function getReactNativePlatformConstants(): any {
  if (Platform.OS === "android") {
    const constants = Platform.constants as PlatformAndroidStatic["constants"]

    return {
      osRelease: constants.Release,
      model: constants.Model,
      serverHost: constants.ServerHost,
      uiMode: constants.uiMode,
      serial: constants.Serial,
    }
  } else if (Platform.OS === "ios") {
    const constants = Platform.constants as PlatformIOSStatic["constants"]
    return {
      forceTouch: constants.forceTouchAvailable || false,
      interfaceIdiom: constants.interfaceIdiom,
      systemName: constants.systemName,
    }
  }

  return {}
}
