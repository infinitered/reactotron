import { renderHook, act } from "@testing-library/react"
import useColorScheme from "./useColorScheme"

describe("useColorScheme", () => {
  const addEventListener = jest.fn()
  const removeEventListener = jest.fn()

  const mockMatchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener,
    removeEventListener
  }))
  
  const originalMatchMedia = window.matchMedia
  
  afterEach(() => {
    jest.resetAllMocks()
    window.matchMedia = originalMatchMedia
  })

  it("should return dark when window.matchMedia is undefined", () => {
    window.matchMedia = undefined

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("dark")
  })

  it("should return light when system preference is light", () => {
    window.matchMedia = mockMatchMedia
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener
    })

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("light")
  })

  it("should return dark when system preference is dark", () => {
    window.matchMedia = mockMatchMedia
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener
    })

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("dark")
  })

  it("should update when system preference changes", () => {
    let colorSchemeChangeHandler: (e: { matches: boolean }) => void
    const _addEventListener = jest.fn().mockImplementation((_, handler) => {
      colorSchemeChangeHandler = handler
    })

    window.matchMedia = mockMatchMedia
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: _addEventListener,
      removeEventListener,
    })

    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("light")

    act(() => {
      colorSchemeChangeHandler({ matches: true })
    })

    expect(result.current).toBe("dark")
  })

  it("should clean up event listener on unmount", () => {
    window.matchMedia = mockMatchMedia

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    })

    const { unmount } = renderHook(() => useColorScheme())
    unmount()

    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function))
  })
})
