import test from "ava"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

function createAction(path: string) {
  return { type: "state.keys.request", payload: { path } }
}

test("won't die if we're not tracking nodes", t => {
  const { reactotron, plugin } = createMstPlugin()
  plugin.onCommand(createAction(""))

  t.is(0, td.explain(reactotron.stateKeysResponse).callCount)
})

test("valid keys", t => {
  const { reactotron, track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  plugin.onCommand(createAction(""))

  const stateKeysResponse = td.explain(reactotron.stateKeysResponse)
  t.is(1, stateKeysResponse.callCount)
  const [atPath, keyList] = stateKeysResponse.calls[0].args
  t.is(null, atPath)
  t.deepEqual(["name", "age"], keyList)
})

test("invalid key path", t => {
  const { reactotron, track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  plugin.onCommand(createAction("does.not.exist"))

  const stateKeysResponse = td.explain(reactotron.stateKeysResponse)
  t.is(1, stateKeysResponse.callCount)
  const [atPath, keyList] = stateKeysResponse.calls[0].args
  t.is("does.not.exist", atPath)
  t.deepEqual([], keyList)
})
