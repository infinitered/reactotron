import { renderHook } from "@testing-library/react-hooks"

import { CommandType } from "../../types"

import useTimline, { StorageKey } from "./useTimeline"

describe("contexts/Timline/useTimeline", () => {
  beforeEach(() => {
    localStorage.removeItem(StorageKey.ReversedOrder)
    localStorage.removeItem(StorageKey.HiddenCommands)
  })

  describe("Initial Settings", () => {
    it("should default to regular order", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.isReversed).toBeFalsy()
    })

    it("should load if user had the timeline reversed", () => {
      localStorage.setItem(StorageKey.ReversedOrder, "reversed")

      const { result } = renderHook(() => useTimline())

      expect(result.current.isReversed).toBeTruthy()
    })

    it("should load if user had the timeline regular order", () => {
      localStorage.setItem(StorageKey.ReversedOrder, "regular")

      const { result } = renderHook(() => useTimline())

      expect(result.current.isReversed).toBeFalsy()
    })

    it("should default to no hidden commands", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.hiddenCommands).toEqual([])
    })

    it("should have saved hidden commands", () => {
      localStorage.setItem(StorageKey.HiddenCommands, JSON.stringify(["test"]))

      const { result } = renderHook(() => useTimline())

      expect(result.current.hiddenCommands).toEqual(["test"])
    })
  })

  describe("actions", () => {
    it("should toggle search", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.isSearchOpen).toBeFalsy()
      result.current.toggleSearch()
      expect(result.current.isSearchOpen).toBeTruthy()
      result.current.toggleSearch()
      expect(result.current.isSearchOpen).toBeFalsy()
    })

    it("should set the search string", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.search).toEqual("")
      result.current.setSearch("H")
      expect(result.current.search).toEqual("H")
      result.current.setSearch("L")
      expect(result.current.search).toEqual("L")
      result.current.setSearch("")
      expect(result.current.search).toEqual("")
    })

    it("should open the filter", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.isFilterOpen).toBeFalsy()
      result.current.openFilter()
      expect(result.current.isFilterOpen).toBeTruthy()
    })

    it("should close the filter", () => {
      const { result } = renderHook(() => useTimline())

      result.current.openFilter()
      expect(result.current.isFilterOpen).toBeTruthy()
      result.current.closeFilter()
      expect(result.current.isFilterOpen).toBeFalsy()
    })

    it("should toggle reverse", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.isReversed).toBeFalsy()
      result.current.toggleReverse()
      expect(localStorage.getItem(StorageKey.ReversedOrder)).toEqual("reversed")
      expect(result.current.isReversed).toBeTruthy()
      result.current.toggleReverse()
      expect(localStorage.getItem(StorageKey.ReversedOrder)).toEqual("regular")
      expect(result.current.isReversed).toBeFalsy()
    })

    it("should set hidden commands", () => {
      const { result } = renderHook(() => useTimline())

      expect(result.current.hiddenCommands).toEqual([])
      result.current.setHiddenCommands([CommandType.ClientIntro])
      expect(localStorage.getItem(StorageKey.HiddenCommands)).toEqual(
        JSON.stringify([CommandType.ClientIntro])
      )
      expect(result.current.hiddenCommands).toEqual([CommandType.ClientIntro])
    })
  })
})
