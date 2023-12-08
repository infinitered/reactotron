import { TestUserModel, createMstPlugin } from "./fixtures"

describe("actions", () => {
  it("sends action complete event", () => {
    const { reactotron, track } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    user.setAge(123)

    // details about the reactotron functions used
    const send = reactotron.send

    // called only once
    expect(send).toHaveBeenCalledTimes(1)

    const payload = {
      name: "setAge()",
      ms: 1,
      action: { name: "setAge", path: "", args: [123] },
      mst: {
        id: 7,
        rootId: 7,
        parentId: 0,
        type: "action",
        modelType: TestUserModel,
        alive: true,
        root: true,
        protected: true,
      },
    }

    // send() params
    expect(send.mock.calls[0][0]).toBe("state.action.complete")
    expect(send.mock.calls[0][1].action).toEqual(payload.action)
  })

  it("sends values changed event", () => {
    const { reactotron, track } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    user.setAge(123)

    // details about the reactotron functions used
    const stateValuesChange = reactotron.stateValuesChange

    // called only once
    expect(stateValuesChange).toHaveBeenCalledTimes(1)
    expect(stateValuesChange.mock.calls[0][0]).toEqual([])
  })
})
