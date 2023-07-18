import type { ISerializedActionCall } from "mobx-state-tree"
import { TestUserModel, createMstPlugin } from "./fixtures"
import { Command } from "reactotron-core-contract"

function createAction(action: ISerializedActionCall) {
  return {
    type: "state.action.dispatch",
    payload: { action },
  } as Command<"state.action.dispatch">
}

describe("dispatch-action", () => {
  it("responds with current state", () => {
    const { track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    const action = createAction({ name: "setAge", path: "", args: [900] })
    track(user)
    plugin.onCommand(action)

    expect(user.age).toEqual(900)
  })

  it("won't die if we're not tracking nodes", () => {
    const { plugin } = createMstPlugin()
    const action = createAction({ name: "setAge", path: "", args: [] })

    expect(() => plugin.onCommand(action)).not.toThrow()
  })

  it("won't die if we target a wrong path", () => {
    const { track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    const action = createAction({ name: "setLoL", path: "", args: [] })
    track(user)

    expect(() => plugin.onCommand(action)).not.toThrow()
  })
})
