import { act, renderHook } from "@testing-library/react-hooks/dom"

import useLayout from "./useLayout"

describe("contexts/Layout/useLayout", () => {
  describe("UI Handling", () => {
    it("should toggle the sidebar", () => {
      const { result } = renderHook(() => useLayout())

      expect(result.current.isSideBarOpen).toBeTruthy()

      act(() => {
        result.current.toggleSideBar()
      })

      expect(result.current.isSideBarOpen).toBeFalsy()

      act(() => {
        result.current.toggleSideBar()
      })

      expect(result.current.isSideBarOpen).toBeTruthy()
    })
  })
})
