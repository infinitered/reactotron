import { act, renderHook } from "@testing-library/react"

import useNetwork, { NetworkStorageKey } from "./useNetwork"

describe("contexts/Network/useNetwork", () => {
  beforeEach(() => {
    localStorage.removeItem(NetworkStorageKey.ReversedOrder)
    localStorage.removeItem(NetworkStorageKey.HiddenCommands)
  })

  describe("Initial Settings", () => {
    it("should default to regular order", () => {
      const { result } = renderHook(() => useNetwork())

      expect(result.current.isReversed).toBeFalsy()
    })

    it("should load if user had the timeline reversed", () => {
      localStorage.setItem(NetworkStorageKey.ReversedOrder, "reversed")

      const { result } = renderHook(() => useNetwork())

      expect(result.current.isReversed).toBeTruthy()
    })

    it("should load if user had the timeline regular order", () => {
      localStorage.setItem(NetworkStorageKey.ReversedOrder, "regular")

      const { result } = renderHook(() => useNetwork())

      expect(result.current.isReversed).toBeFalsy()
    })
  })

  describe("actions", () => {
    it("should toggle search", () => {
      const { result } = renderHook(() => useNetwork())

      expect(result.current.isSearchOpen).toBeFalsy()
      act(() => {
        result.current.toggleSearch()
      })
      expect(result.current.isSearchOpen).toBeTruthy()
      act(() => {
        result.current.toggleSearch()
      })
      expect(result.current.isSearchOpen).toBeFalsy()
    })

    it("should set the search string", () => {
      const { result } = renderHook(() => useNetwork())

      expect(result.current.search).toEqual("")
      act(() => {
        result.current.setSearch("H")
      })
      expect(result.current.search).toEqual("H")
      act(() => {
        result.current.setSearch("L")
      })
      expect(result.current.search).toEqual("L")
      act(() => {
        result.current.setSearch("")
      })
      expect(result.current.search).toEqual("")
    })

    it("should toggle reverse", () => {
      const { result } = renderHook(() => useNetwork())

      expect(result.current.isReversed).toBeFalsy()
      act(() => {
        result.current.toggleReverse()
      })
      expect(localStorage.getItem(NetworkStorageKey.ReversedOrder)).toEqual("reversed")
      expect(result.current.isReversed).toBeTruthy()
      act(() => {
        result.current.toggleReverse()
      })
      expect(localStorage.getItem(NetworkStorageKey.ReversedOrder)).toEqual("regular")
      expect(result.current.isReversed).toBeFalsy()
    })
  })
})
