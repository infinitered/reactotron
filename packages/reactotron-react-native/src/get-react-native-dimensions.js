import { Dimensions } from 'react-native'

/**
 * Gets the react native version, if any, as a semver string.
 */
export default function getReactNativeDimensions () {
  try {
    const screen = Dimensions.get('screen')
    const win = Dimensions.get('window')

    return {
      screenWidth: Math.ceil(screen.width),
      screenHeight: Math.ceil(screen.height),
      screenScale: screen.scale,
      screenFontScale: screen.fontScale,
      windowWidth: win.width,
      windowHeight: win.height,
      windowScale: win.scale,
      windowFontScale: win.fontScale
    }
  } catch (e) {}
}
