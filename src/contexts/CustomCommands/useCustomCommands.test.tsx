/* eslint-disable react/display-name */
import React from "react"
import { renderHook } from "@testing-library/react-hooks"

import ReactotronContext from "../Reactotron"
import { CommandType } from "../../types"

import useCustomCommands from "./useCustomCommands"

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

describe("contexts/CustomCommands/useCustomCommands", () => {
  it("should add and remove custom commands", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: callback => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useCustomCommands(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    expect(result.current.customCommands).toEqual([])

    addCallback({
      type: CommandType.CustomCommandRegister,
      clientId: "1234",
      payload: {
        id: 0,
      },
    })

    expect(result.current.customCommands).toEqual([
      {
        clientId: "1234",
        id: 0,
      },
    ])

    addCallback({
      type: CommandType.CustomCommandUnregister,
      clientId: "1234",
      payload: {
        id: 0,
      },
    })

    expect(result.current.customCommands).toEqual([])
  })

  it("should clear all commands after a reconnect", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: callback => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useCustomCommands(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    expect(result.current.customCommands).toEqual([])

    addCallback({
      type: CommandType.CustomCommandRegister,
      clientId: "1234",
      payload: {
        id: 0,
      },
    })

    expect(result.current.customCommands).toEqual([
      {
        clientId: "1234",
        id: 0,
      },
    ])

    addCallback({
      type: CommandType.ClientIntro,
      clientId: "1234",
    })

    expect(result.current.customCommands).toEqual([])
  })
})
