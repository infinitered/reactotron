import { Platform, PlatformIOSStatic, PlatformAndroidStatic } from "react-native"

interface PlatformConstants {
  osRelease: string
  model: string
  serverHost: string
  uiMode: string
  serial: string
  forceTouch: boolean
  interfaceIdiom: string
  systemName: string
}

export default function getReactNativePlatformConstants(): PlatformConstants {
  const defaults: PlatformConstants = {
    osRelease: "",
    model: "",
    serverHost: "",
    uiMode: "",
    serial: "",
    forceTouch: false,
    interfaceIdiom: "",
    systemName: "",
  }

  if (Platform.OS === "android") {
    const constants = Platform.constants as PlatformAndroidStatic["constants"]

    return {
      ...defaults,
      osRelease: constants.Release,
      model: constants.Model,
      serverHost: constants.ServerHost,
      uiMode: constants.uiMode,
      serial: constants.Serial,
    }
  } else if (Platform.OS === "ios") {
    const constants = Platform.constants as PlatformIOSStatic["constants"]
    return {
      ...defaults,
      forceTouch: constants.forceTouchAvailable || false,
      interfaceIdiom: constants.interfaceIdiom,
      systemName: constants.systemName,
    }
  }

  return defaults
}
