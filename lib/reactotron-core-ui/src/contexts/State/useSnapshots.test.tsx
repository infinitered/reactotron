/* eslint-disable react/display-name */
import React from "react"
import { act, renderHook } from "@testing-library/react-hooks"

import { CommandType } from "reactotron-core-contract"
import ReactotronContext from "../Reactotron"

import useSnapshots from "./useSnapshots"

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

describe("contexts/State/useSnapshots", () => {
  it("should add a subscription when a command to do so comes in", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: (callback) => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useSnapshots(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    expect(result.current.snapshots).toEqual([])

    act(() => {
      addCallback({
        type: CommandType.StateBackupResponse,
        clientId: "1234",
        payload: {
          id: 0,
          name: "test",
        },
      })
    })

    expect(result.current.snapshots).toEqual([
      {
        id: 0,
        name: "test",
      },
    ])
  })

  it("should request a subscription", () => {
    const contextValues = buildContextValues()

    const { result } = renderHook(() => useSnapshots(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    act(() => {
      result.current.createSnapshot()
    })

    expect(contextValues.sendCommand).toHaveBeenCalledWith("state.backup.request", {})
  })

  it("should request a restore", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: (callback) => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useSnapshots(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    act(() => {
      addCallback({
        type: CommandType.StateBackupResponse,
        clientId: "1234",
        payload: {
          id: 0,
          name: "test",
          state: { test: true },
        },
      })
    })

    act(() => {
      result.current.restoreSnapshot(result.current.snapshots[0])
    })

    expect(contextValues.sendCommand).toHaveBeenCalledWith("state.restore.request", {
      state: result.current.snapshots[0].state,
    })
  })

  it("should remove a restore", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: (callback) => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useSnapshots(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    act(() => {
      addCallback({
        type: CommandType.StateBackupResponse,
        clientId: "1234",
        payload: {
          id: 0,
          name: "test",
          state: { test: true },
        },
      })
    })

    act(() => {
      result.current.removeSnapshot(result.current.snapshots[0])
    })

    expect(result.current.snapshots.length).toEqual(0)
  })

  it("should open and close the rename modal", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: (callback) => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useSnapshots(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    act(() => {
      addCallback({
        type: CommandType.StateBackupResponse,
        clientId: "1234",
        payload: {
          id: 0,
          name: "test",
          state: { test: true },
        },
      })
    })

    act(() => {
      result.current.openSnapshotRenameModal(result.current.snapshots[0])
    })
    expect(result.current.isSnapshotRenameModalOpen).toBeTruthy()

    act(() => {
      result.current.closeSnapshotRenameModal()
    })
    expect(result.current.isSnapshotRenameModalOpen).toBeFalsy()
  })

  it("should rename a restore", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: (callback) => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useSnapshots(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    act(() => {
      addCallback({
        type: CommandType.StateBackupResponse,
        clientId: "1234",
        payload: {
          id: 0,
          name: "test",
          state: { test: true },
        },
      })
    })

    act(() => {
      result.current.openSnapshotRenameModal(result.current.snapshots[0])
    })

    expect(result.current.renameingSnapshot).toEqual(result.current.snapshots[0])

    act(() => {
      result.current.renameSnapshot("test2")
    })

    expect(result.current.snapshots[0].name).toEqual("test2")
  })
})
