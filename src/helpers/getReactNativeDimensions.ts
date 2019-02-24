import { Dimensions } from "react-native"

interface AppDimensions {
  screenWidth: number
  screenHeight: number
  screenScale: number
  screenFontScale: number
  windowWidth: number
  windowHeight: number
  windowScale: number
  windowFontScale: number
}

export function getReactNativeDimensionsWithDimensions(
  screen: any,
  win: any
): AppDimensions | null {
  try {
    return {
      screenWidth: Math.ceil(screen.width),
      screenHeight: Math.ceil(screen.height),
      screenScale: screen.scale,
      screenFontScale: screen.fontScale,
      windowWidth: Math.ceil(win.width),
      windowHeight: Math.ceil(win.height),
      windowScale: win.scale,
      windowFontScale: win.fontScale,
    }
  } catch (e) {}

  return null
}

export default function getReactNativeDimensions(): AppDimensions | null {
  const screen = Dimensions.get("screen")
  const win = Dimensions.get("window")

  return getReactNativeDimensionsWithDimensions(screen, win)
}
