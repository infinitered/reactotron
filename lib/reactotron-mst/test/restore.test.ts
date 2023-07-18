import { getSnapshot } from "mobx-state-tree"
import { TestUserModel, createMstPlugin } from "./fixtures"
import { Command } from "reactotron-core-contract"

const STATE = { age: 1, name: "i" }
const INBOUND = {
  type: "state.restore.request",
  payload: { state: STATE },
} as unknown as Command<"state.restore.request">

describe("restore", () => {
  it("responds with current state", () => {
    const { track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(INBOUND)
    expect(getSnapshot(user)).toEqual(STATE)
  })

  it("won't die if we're not tracking nodes", () => {
    const { plugin } = createMstPlugin()
    expect(() => plugin.onCommand(INBOUND)).not.toThrow()
  })
})
