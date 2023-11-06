import td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

describe("actions", () => {
  it("sends action complete event", () => {
    const { reactotron, track } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    user.setAge(123)

    // details about the reactotron functions used
    const send = td.explain(reactotron.send)

    // called only once
    expect(send.callCount).toEqual(1)

    const payload = {
      name: "setAge()",
      ms: 1,
      action: { name: "setAge", path: "", args: [123] },
      mst: {
        id: 1,
        rootId: 1,
        parentId: 0,
        type: "action",
        modelType: TestUserModel,
        alive: true,
        root: true,
        protected: true,
      },
    }

    // send() params
    expect(send.calls[0].args).toEqual(["state.action.complete", payload])
  })

  it("sends values changed event", () => {
    const { reactotron, track } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    user.setAge(123)

    // details about the reactotron functions used
    const stateValuesChange = td.explain(reactotron.stateValuesChange)

    // called only once
    expect(stateValuesChange.callCount).toEqual(1)
    expect(stateValuesChange.calls[0].args).toEqual([[]])
  })
})
