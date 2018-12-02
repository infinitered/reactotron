import test from "ava"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin, createTestCompany } from "./fixtures"

function createAction(paths: any) {
  return {
    type: "state.values.subscribe",
    payload: { paths },
  }
}

test("won't die if we're not tracking nodes", t => {
  const { plugin } = createMstPlugin()
  const action = createAction(["hey"])

  t.notThrows(() => plugin.onCommand(action))
})

test("accepts 1 path", t => {
  const { track, reactotron, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  const action = createAction(["age"])
  track(user)
  plugin.onCommand(action)

  const stateValuesChange = td.explain(reactotron.stateValuesChange)
  t.is(1, stateValuesChange.callCount)
  t.deepEqual([{ path: "age", value: 100 }], stateValuesChange.calls[0].args[0])
})

test("accepts 2 paths", t => {
  const { track, reactotron, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  const action = createAction(["age", "name"])
  track(user)
  plugin.onCommand(action)

  const stateValuesChange = td.explain(reactotron.stateValuesChange)
  t.is(1, stateValuesChange.callCount)
  t.deepEqual(
    [{ path: "age", value: 100 }, { path: "name", value: "" }],
    stateValuesChange.calls[0].args[0],
  )
})

test("ignores dupes", t => {
  const { track, reactotron, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  const action = createAction(["age", "age"])
  track(user)

  plugin.onCommand(action)

  const stateValuesChange = td.explain(reactotron.stateValuesChange)
  t.is(1, stateValuesChange.callCount)
  t.deepEqual([{ path: "age", value: 100 }], stateValuesChange.calls[0].args[0])
})

test("handles missing keys", t => {
  const { track, reactotron, plugin } = createMstPlugin()
  const user = TestUserModel.create()
  const action = createAction(["lol"])
  track(user)
  plugin.onCommand(action)

  const stateValuesChange = td.explain(reactotron.stateValuesChange)
  t.is(1, stateValuesChange.callCount)
  t.deepEqual([{ path: "lol", value: undefined }], stateValuesChange.calls[0].args[0])
})

test("nested objects", t => {
  const { track, reactotron, plugin } = createMstPlugin()
  const action = createAction(["owner.age"])
  track(createTestCompany())
  plugin.onCommand(action)

  const stateValuesChange = td.explain(reactotron.stateValuesChange)
  t.is(1, stateValuesChange.callCount)
  t.deepEqual([{ path: "owner.age", value: 100 }], stateValuesChange.calls[0].args[0])
})

test("nested arrays", t => {
  const { track, reactotron, plugin } = createMstPlugin()
  const action = createAction(["employees.1.age"])
  track(createTestCompany())
  plugin.onCommand(action)

  const stateValuesChange = td.explain(reactotron.stateValuesChange)
  t.is(1, stateValuesChange.callCount)
  t.deepEqual([{ path: "employees.1.age", value: 2 }], stateValuesChange.calls[0].args[0])
})
