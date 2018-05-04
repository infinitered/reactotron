import test from "ava"
import { getSnapshot } from "mobx-state-tree"
import { TestUserModel, createMstPlugin } from "./fixtures"

const STATE = { age: 1, name: "i" }
const INBOUND = {
  type: "state.restore.request",
  payload: { state: STATE },
}

test("responds with current state", t => {
  const { track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  plugin.onCommand(INBOUND)
  t.deepEqual(STATE, getSnapshot(user))
})

test("won't die if we're not tracking nodes", t => {
  const { plugin } = createMstPlugin()
  t.notThrows(() => plugin.onCommand(INBOUND))
})
