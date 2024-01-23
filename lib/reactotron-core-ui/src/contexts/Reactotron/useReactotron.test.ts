import { act, renderHook } from "@testing-library/react"

import useReactotron from "./useReactotron"

describe("contexts/Reactotron/useReactotron", () => {
  describe("Dispatch Modal", () => {
    it("should allow opening the modal", () => {
      const { result } = renderHook(() => useReactotron())

      expect(result.current.isDispatchModalOpen).toBe(false)

      act(() => {
        result.current.openDispatchModal("{ hello: true }")
      })

      expect(result.current.isDispatchModalOpen).toBe(true)
      expect(result.current.dispatchModalInitialAction).toBe("{ hello: true }")
    })

    it("should close the modal after it is open", () => {
      const { result } = renderHook(() => useReactotron())

      expect(result.current.isDispatchModalOpen).toBe(false)
      act(() => {
        result.current.openDispatchModal("{ hello: true }")
      })

      act(() => {
        result.current.closeDispatchModal()
      })

      expect(result.current.isDispatchModalOpen).toBe(false)
    })
  })

  describe("Subscription Modal", () => {
    it("should allow opening the modal", () => {
      const { result } = renderHook(() => useReactotron())

      expect(result.current.isSubscriptionModalOpen).toBe(false)

      act(() => {
        result.current.openSubscriptionModal()
      })

      expect(result.current.isSubscriptionModalOpen).toBe(true)
    })

    it("should close the modal after it is open", () => {
      const { result } = renderHook(() => useReactotron())

      expect(result.current.isSubscriptionModalOpen).toBe(false)
      act(() => {
        result.current.openSubscriptionModal()
      })

      act(() => {
        result.current.closeSubscriptionModal()
      })

      expect(result.current.isSubscriptionModalOpen).toBe(false)
    })
  })
})
