import test from "ava"
import { TestUserModel, createMstPlugin } from "./fixtures"

function createAction(action: any) {
  return {
    type: "state.action.dispatch",
    payload: { action },
  }
}

test("responds with current state", t => {
  const { track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  const action = createAction({ name: "setAge", path: "", args: [900] })
  track(user)
  plugin.onCommand(action)

  t.is(900, user.age)
})

test("won't die if we're not tracking nodes", t => {
  const { plugin } = createMstPlugin()
  const action = createAction({ name: "setAge", path: "", args: [] })

  t.notThrows(() => plugin.onCommand(action))
})

test("won't die if we target a wrong path", t => {
  const { track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  const action = createAction({ name: "setLoL", path: "", args: [] })
  track(user)

  t.notThrows(() => plugin.onCommand(action))
})
