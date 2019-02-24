import { NativeModules } from "react-native"

export function getReactNativeVersionWithModules(nativeModules: any): string | null {
  try {
    // dodge some bullets
    if (!nativeModules.PlatformConstants) return null
    if (!nativeModules.PlatformConstants.reactNativeVersion) return null

    // grab the raw numbers
    const major = nativeModules.PlatformConstants.reactNativeVersion.major
    const minor = nativeModules.PlatformConstants.reactNativeVersion.minor
    const patch = nativeModules.PlatformConstants.reactNativeVersion.patch
    const prerelease = nativeModules.PlatformConstants.reactNativeVersion.prerelease

    // check the major or jet
    if (typeof major !== "number") return null

    // assemble!
    const vParts = []
    vParts.push(`${major}.${minor}.${patch}`)
    if (prerelease) vParts.push(`-${prerelease}`)
    return vParts.join("")
  } catch {}

  return null
}

export default function getReactNativeVersion(): string | null {
  return getReactNativeVersionWithModules(NativeModules)
}
