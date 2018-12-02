import test from "ava"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

const INBOUND = { type: "state.backup.request" }
const OUTBOUND = { type: "state.backup.response" }

test("responds with current state", t => {
  const { reactotron, track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  plugin.onCommand(INBOUND)

  const send = td.explain(reactotron.send)
  t.is(1, send.callCount)
  const [type, payload] = send.calls[0].args
  t.is(OUTBOUND.type, type)
  t.deepEqual({ state: { age: 100, name: "" } }, payload)
})

test("won't die if we're not tracking nodes", t => {
  const { reactotron, plugin } = createMstPlugin()
  plugin.onCommand(OUTBOUND)

  t.is(0, td.explain(reactotron.send).callCount)
})
