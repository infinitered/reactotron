/* eslint-disable react/display-name */
import { renderHook } from "@testing-library/react"
import useColorScheme from "./useColorScheme"

describe("useColorScheme", () => {
  let mockMatchMedia: jest.Mock
  let mockAddEventListener: jest.Mock
  let mockRemoveEventListener: jest.Mock

  beforeEach(() => {
    mockAddEventListener = jest.fn()
    mockRemoveEventListener = jest.fn()
    mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    })

    window.matchMedia = mockMatchMedia
  })

  it("should return dark when window is undefined", () => {
    const windowSpy = jest.spyOn(global, "window", "get")
    windowSpy.mockImplementation(() => undefined as any)

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("dark")

    windowSpy.mockRestore()
  })

  it("should return light when system preference is light", () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    })

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("light")
  })

  it("should return dark when system preference is dark", () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    })

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("dark")
  })

  it("should update when system preference changes", () => {
    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("light")

    const handler = mockAddEventListener.mock.calls[0][1]
    handler({ matches: true })

    expect(result.current).toBe("dark")
  })

  it("should clean up event listener on unmount", () => {
    const { unmount } = renderHook(() => useColorScheme())
    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalled()
  })
})
