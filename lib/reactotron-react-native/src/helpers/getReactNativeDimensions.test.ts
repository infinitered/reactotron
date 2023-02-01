import { getReactNativeDimensionsWithDimensions } from "./getReactNativeDimensionsWithDimensions"

describe("getReactNativeDimensions", () => {
  it("should return dimensions", () => {
    const screenDimensions = { width: 10, height: 51, scale: 1, fontScale: 3 }
    const windowDimensions = { width: 10, height: 15, scale: 23, fontScale: 3 }
    const result = getReactNativeDimensionsWithDimensions(screenDimensions, windowDimensions)

    expect(result).toEqual({
      screenWidth: Math.ceil(screenDimensions.width),
      screenHeight: Math.ceil(screenDimensions.height),
      screenScale: screenDimensions.scale,
      screenFontScale: screenDimensions.fontScale,
      windowWidth: Math.ceil(windowDimensions.width),
      windowHeight: Math.ceil(windowDimensions.height),
      windowScale: windowDimensions.scale,
      windowFontScale: windowDimensions.fontScale,
    })
  })
})
