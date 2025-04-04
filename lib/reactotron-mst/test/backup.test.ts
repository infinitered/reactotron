import { TestUserModel, commandMetadataFixture, createMstPlugin } from "./fixtures"
import type { Command } from "reactotron-core-contract"

const INBOUND = {
  ...commandMetadataFixture,
  type: "state.backup.request",
  payload: { state: { age: 100, name: "" } },
} satisfies Command<"state.backup.request">
const OUTBOUND = {
  ...commandMetadataFixture,
  type: "state.backup.response",
  payload: { state: { age: 100, name: "" } },
} satisfies Command<"state.backup.response">

describe("backup", () => {
  it("responds with current state", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(INBOUND)

    const send = reactotron.send

    expect(send).toHaveBeenCalledTimes(1)
    const [type, payload] = send.mock.calls[0]
    expect(type).toEqual(OUTBOUND.type)
    expect(payload).toEqual({ state: { age: 100, name: "" } })
  })

  it("won't die if we're not tracking nodes", () => {
    const { reactotron, plugin } = createMstPlugin()
    plugin.onCommand(OUTBOUND)

    expect(reactotron.send).toHaveBeenCalledTimes(0)
  })
})
