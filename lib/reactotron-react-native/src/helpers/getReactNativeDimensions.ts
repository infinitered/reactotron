import { Dimensions } from "react-native"
import {
  AppDimensions,
  getReactNativeDimensionsWithDimensions,
} from "./getReactNativeDimensionsWithDimensions"

export default function getReactNativeDimensions(): AppDimensions | null {
  let screen = null
  let win = null

  try {
    screen = Dimensions.get("screen")
  } catch {}

  try {
    win = Dimensions.get("window")
  } catch {}

  return getReactNativeDimensionsWithDimensions(screen, win)
}
