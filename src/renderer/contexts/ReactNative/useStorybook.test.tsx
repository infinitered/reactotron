/* eslint-disable react/display-name */
import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import { CommandType, ReactotronContext } from "reactotron-core-ui"

import useStorybook from "./useStorybook"

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

describe("contexts/ReactNative/useStorybook", () => {
  it("should call send command when storybook is turned on and off", () => {
    const contextValues = buildContextValues()

    const { result } = renderHook(() => useStorybook(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    expect(result.current.isStorybookOn).toBeFalsy()

    result.current.turnOnStorybook()

    expect(result.current.isStorybookOn).toBeTruthy()
    expect(contextValues.sendCommand).toHaveBeenLastCalledWith("storybook", true)

    result.current.turnOffStorybook()

    expect(result.current.isStorybookOn).toBeFalsy()
    expect(contextValues.sendCommand).toHaveBeenLastCalledWith("storybook", false)
  })

  it("should send current storybook status to connecting clients", () => {
    let addCallback = null

    const contextValues = buildContextValues({
      addCommandListener: callback => {
        addCallback = callback
      },
    })

    const { result } = renderHook(() => useStorybook(), {
      wrapper: ({ children }) => (
        <ReactotronContext.Provider value={contextValues}>{children}</ReactotronContext.Provider>
      ),
    })

    addCallback({ type: CommandType.ClientIntro, clientId: "1234" })
    expect(contextValues.sendCommand).toHaveBeenLastCalledWith("storybook", false, "1234")

    result.current.turnOnStorybook()

    addCallback({ type: CommandType.ClientIntro, clientId: "1234" })
    expect(contextValues.sendCommand).toHaveBeenLastCalledWith("storybook", true, "1234")
  })
})
