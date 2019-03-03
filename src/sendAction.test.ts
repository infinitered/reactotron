import createSendAction from "./sendAction"
import { defaultReactotronMock } from './testHelpers'

describe("sendAction", () => {
  it("should send a basic action to reactotron", () => {
    const mockReactotron = {
      ...defaultReactotronMock,
      send: jest.fn(),
    }
    const sendAction = createSendAction(mockReactotron)

    sendAction({ type: "My Type" }, 10, false)

    expect(mockReactotron.send).toHaveBeenCalledWith(
      "state.action.complete",
      { name: "My Type", action: { type: "My Type" }, ms: 10 },
      false
    )
  })

  it("should send a important action to reactotron", () => {
    const mockReactotron = {
      ...defaultReactotronMock,
      send: jest.fn(),
    }
    const sendAction = createSendAction(mockReactotron)

    sendAction({ type: "My Type" }, 10, true)

    expect(mockReactotron.send).toHaveBeenCalledWith(
      "state.action.complete",
      { name: "My Type", action: { type: "My Type" }, ms: 10 },
      true
    )
  })

  it.todo("should handle the type of an action being a symbol")
})
