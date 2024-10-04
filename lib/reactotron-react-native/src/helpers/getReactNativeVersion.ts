import { getReactNativeVersionWithModules } from "./getReactNativeVersionWithModules"
import { Platform } from "react-native"

export default function getReactNativeVersion(): string | null {
  return getReactNativeVersionWithModules(Platform.constants)
}
