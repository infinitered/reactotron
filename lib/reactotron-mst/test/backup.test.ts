import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

const INBOUND = { type: "state.backup.request" }
const OUTBOUND = { type: "state.backup.response" }

describe("backup", () => {
  it("responds with current state", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(INBOUND)

    const send = td.explain(reactotron.send)
    expect(send.callCount).toEqual(1)
    const [type, payload] = send.calls[0].args
    expect(type).toEqual(OUTBOUND.type)
    expect(payload).toEqual({ state: { age: 100, name: "" } })
  })

  it("won't die if we're not tracking nodes", () => {
    const { reactotron, plugin } = createMstPlugin()
    plugin.onCommand(OUTBOUND)

    expect(td.explain(reactotron.send).callCount).toEqual(0)
  })
})
