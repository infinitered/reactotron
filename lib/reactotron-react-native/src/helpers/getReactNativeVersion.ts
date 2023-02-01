import { NativeModules } from "react-native"
import { getReactNativeVersionWithModules } from "./getReactNativeVersionWithModules"

export default function getReactNativeVersion(): string | null {
  return getReactNativeVersionWithModules(NativeModules)
}
