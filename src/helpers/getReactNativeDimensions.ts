import { Dimensions } from "react-native"

interface AppDimensions {
  screenWidth?: number
  screenHeight?: number
  screenScale?: number
  screenFontScale?: number
  windowWidth?: number
  windowHeight?: number
  windowScale?: number
  windowFontScale?: number
}

export function getReactNativeDimensionsWithDimensions(
  screen: any,
  win: any
): AppDimensions | null {
  try {
    let screenInfo = {}
    let windowInfo = {}

    if (screen) {
      screenInfo = {
        screenWidth: Math.ceil(screen.width),
        screenHeight: Math.ceil(screen.height),
        screenScale: screen.scale,
        screenFontScale: screen.fontScale,
      }
    }

    if (win) {
      windowInfo = {
        windowWidth: Math.ceil(win.width),
        windowHeight: Math.ceil(win.height),
        windowScale: win.scale,
        windowFontScale: win.fontScale,
      }
    }

    return {
      ...screenInfo,
      ...windowInfo,
    }
  } catch (e) {}

  return null
}

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
