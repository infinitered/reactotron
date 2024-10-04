export function getReactNativeVersionWithModules(constants: any): string | null {
  try {
    // dodge some bullets
    if (!constants) return null
    if (!constants.reactNativeVersion) return null

    // grab the raw numbers
    const major = constants.reactNativeVersion.major
    const minor = constants.reactNativeVersion.minor
    const patch = constants.reactNativeVersion.patch
    const prerelease = constants.reactNativeVersion.prerelease

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
