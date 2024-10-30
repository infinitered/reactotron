import { getReactNativeVersionWithModules } from "./getReactNativeVersionWithModules"

describe("getReactNativeVersion", () => {
  it("should return null if platform constants is null", () => {
    const result = getReactNativeVersionWithModules({})

    expect(result).toBe(null)
  })

  it("should return null if the major version is not a number", () => {
    const result = getReactNativeVersionWithModules({ reactNativeVersion: { major: "Hello" } })

    expect(result).toBe(null)
  })

  it("should return a version", () => {
    const result = getReactNativeVersionWithModules({
      reactNativeVersion: { major: 0, minor: 59, patch: 8, prerelease: 5 },
    })

    expect(result).toEqual("0.59.8-5")
  })
})
