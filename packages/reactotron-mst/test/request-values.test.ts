import test from "ava"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

function createAction(path: string) {
  return { type: "state.values.request", payload: { path } }
}

test("won't die if we're not tracking nodes", t => {
  const { reactotron, plugin } = createMstPlugin()
  plugin.onCommand(createAction(""))

  t.is(0, td.explain(reactotron.stateValuesResponse).callCount)
})

test("valid values", t => {
  const { reactotron, track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  plugin.onCommand(createAction(""))

  const stateValuesResponse = td.explain(reactotron.stateValuesResponse)
  t.is(1, stateValuesResponse.callCount)
  const [atPath, keyList] = stateValuesResponse.calls[0].args
  t.is(null, atPath)
  t.deepEqual({ name: "", age: 100 }, keyList)
})

test("invalid key path", t => {
  const { reactotron, track, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  plugin.onCommand(createAction("does.not.exist"))

  const stateValuesResponse = td.explain(reactotron.stateValuesResponse)
  t.is(1, stateValuesResponse.callCount)
  const [atPath, values] = stateValuesResponse.calls[0].args
  t.is("does.not.exist", atPath)
  t.deepEqual(undefined, values)
})
