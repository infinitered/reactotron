import { NativeModules } from 'react-native'

/**
 * Gets the react native version, if any, as a semver string.
 */
export default function getReactNativeVersion () {
  try {
    // dodge some bullets
    if (!NativeModules.PlatformConstants) return
    if (!NativeModules.PlatformConstants.reactNativeVersion) return

    // grab the raw numbers
    const major = NativeModules.PlatformConstants.reactNativeVersion.major
    const minor = NativeModules.PlatformConstants.reactNativeVersion.minor
    const patch = NativeModules.PlatformConstants.reactNativeVersion.patch
    const prerelease = NativeModules.PlatformConstants.reactNativeVersion.prerelease

    // check the major or jet
    if (typeof major !== 'number') return

    // assemble!
    const vParts = []
    vParts.push(`${major}.${minor}.${patch}`)
    if (prerelease) vParts.push(`-${prerelease}`)
    return vParts.join('')
  } catch (e) {}
}
