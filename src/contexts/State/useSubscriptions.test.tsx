/* eslint-disable react/display-name */
import React from "react"
import { renderHook } from "@testing-library/react-hooks"

import ReactotronContext from "../Reactotron"

import useSubscriptions, { StorageKey } from "./useSubscriptions"

function buildContextValues({ addCommandListener = null } = {}) {
  return {
    commands: [],
    sendCommand: jest.fn(),
    clearCommands: jest.fn(),
    addCommandListener: addCommandListener || jest.fn(),
    isDispatchModalOpen: false,
    dispatchModalInitialAction: "",
    openDispatchModal: jest.fn(),
    closeDispatchModal: jest.fn(),
    isSubscriptionModalOpen: false,
    openSubscriptionModal: jest.fn(),
    closeSubscriptionModal: jest.fn(),
  }
}

describe("contexts/State/useSubscriptions", () => {
  beforeEach(() => {
    localStorage.removeItem(StorageKey.Subscriptions)
  })

  describe("Initial Settings", () => {
    it("should default to no subscriptions", () => {
      const contextValues = buildContextValues()

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      expect(result.current.subscriptions).toEqual([])
    })

    it("should have a stored list of subscriptions", () => {
      const contextValues = buildContextValues()

      localStorage.setItem(StorageKey.Subscriptions, JSON.stringify(["test", "test2"]))

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      expect(result.current.subscriptions).toEqual(["test", "test2"])
    })
  })

  describe("Actions", () => {
    it("should add a subscription", () => {
      const contextValues = buildContextValues()

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      result.current.addSubscription("test")

      expect(result.current.subscriptions).toEqual(["test"])
      expect(contextValues.sendCommand).toHaveBeenCalledWith("state.values.subscribe", { paths: ["test"] })
      expect(localStorage.getItem(StorageKey.Subscriptions)).toEqual(JSON.stringify(["test"]))
    })

    it("should not add a duplicate subscription", () => {
      const contextValues = buildContextValues()

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      result.current.addSubscription("test")

      expect(result.current.subscriptions).toEqual(["test"])
      expect(contextValues.sendCommand).toHaveBeenCalledWith("state.values.subscribe", { paths: ["test"] })
      expect(localStorage.getItem(StorageKey.Subscriptions)).toEqual(JSON.stringify(["test"]))

      result.current.addSubscription("test")
      expect(result.current.subscriptions.length).toEqual(1)
    })

    it("should remove a subscription", () => {
      localStorage.setItem(StorageKey.Subscriptions, JSON.stringify(["test", "test2", "test3"]))
      const contextValues = buildContextValues()

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      result.current.removeSubscription("test2")

      expect(result.current.subscriptions).toEqual(["test", "test3"])
      expect(contextValues.sendCommand).toHaveBeenCalledWith("state.values.subscribe", {
        paths: ["test", "test3"],
      })
      expect(localStorage.getItem(StorageKey.Subscriptions)).toEqual(
        JSON.stringify(["test", "test3"])
      )
    })

    it("should handle removing a subscription that does not exist", () => {
      localStorage.setItem(StorageKey.Subscriptions, JSON.stringify(["test", "test2"]))
      const contextValues = buildContextValues()

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      result.current.removeSubscription("test3")

      expect(result.current.subscriptions).toEqual(["test", "test2"])
      expect(contextValues.sendCommand).toHaveBeenCalledWith("state.values.subscribe", {
        paths: ["test", "test2"],
      })
      expect(localStorage.getItem(StorageKey.Subscriptions)).toEqual(
        JSON.stringify(["test", "test2"])
      )
    })

    it("should clear subscriptions", () => {
      localStorage.setItem(StorageKey.Subscriptions, JSON.stringify(["test", "test2"]))
      const contextValues = buildContextValues()

      const { result } = renderHook(() => useSubscriptions(), {
        wrapper: ({ children }) => (
          <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
        ),
      })

      result.current.clearSubscriptions()

      expect(result.current.subscriptions).toEqual([])
      expect(contextValues.sendCommand).toHaveBeenCalledWith("state.values.subscribe", {
        paths: [],
      })
      expect(localStorage.getItem(StorageKey.Subscriptions)).toEqual(JSON.stringify([]))
    })
  })
})
