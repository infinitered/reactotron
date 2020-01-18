import { renderHook } from "@testing-library/react-hooks"

import useReactotron from "./useReactotron"

describe("contexts/Reactotron/useReactotron", () => {
  describe("Dispatch Modal", () => {
    it("should allow opening the modal", () => {
      const { result } = renderHook(() => useReactotron())

      expect(result.current.isDispatchModalOpen).toBe(false)

      result.current.openDispatchModal("{ hello: true }")

      expect(result.current.isDispatchModalOpen).toBe(true)
      expect(result.current.dispatchModalInitialAction).toBe("{ hello: true }")
    })

    it("should close the modal after it is open", () => {
      const { result } = renderHook(() => useReactotron())

      expect(result.current.isDispatchModalOpen).toBe(false)
      result.current.openDispatchModal("{ hello: true }")

      result.current.closeDispatchModal()

      expect(result.current.isDispatchModalOpen).toBe(false)
    })
  })
})
