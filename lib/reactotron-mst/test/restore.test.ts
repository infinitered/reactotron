import { getSnapshot } from "mobx-state-tree"
import { TestUserModel, commandMetadataFixture, createMstPlugin } from "./fixtures"
import type { Command } from "reactotron-core-contract"

const STATE = { age: 1, name: "i" }
const INBOUND = {
  ...commandMetadataFixture,
  type: "state.restore.request",
  payload: { state: STATE },
} satisfies Command<"state.restore.request">

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
