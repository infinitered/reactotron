import { renderHook } from "@testing-library/react-hooks"

import useLayout from "./useLayout"

describe("contexts/Layout/useLayout", () => {
  describe("UI Handling", () => {
    it("should toggle the sidebar", () => {
      const { result } = renderHook(() => useLayout())

      expect(result.current.isSideBarOpen).toBeTruthy()

      result.current.toggleSideBar()

      expect(result.current.isSideBarOpen).toBeFalsy()

      result.current.toggleSideBar()

      expect(result.current.isSideBarOpen).toBeTruthy()
    })
  })
})
