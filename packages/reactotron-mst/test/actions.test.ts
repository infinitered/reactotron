import test from "ava"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

// serial is here because mst has a internal counter for ids :|
test.serial("sends action complete event", t => {
  const { reactotron, track } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  user.setAge(123)

  // details about the reactotron functions used
  const send = td.explain(reactotron.send)

  // called only once
  t.is(1, send.callCount)

  const payload = {
    name: "setAge()",
    ms: 1,
    action: { name: "setAge", path: "", args: [123] },
    mst: {
      id: 1,
      rootId: 1,
      parentId: 0,
      type: "action",
      modelType: TestUserModel,
      alive: true,
      root: true,
      protected: true,
    },
  }

  // send() params
  t.deepEqual(["state.action.complete", payload], send.calls[0].args)
})

// serial is here because mst has a internal counter for ids :|
test.serial("sends values changed event", t => {
  const { reactotron, track } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  user.setAge(123)

  // details about the reactotron functions used
  const stateValuesChange = td.explain(reactotron.stateValuesChange)

  // called only once
  t.is(1, stateValuesChange.callCount)
  t.deepEqual([[]], stateValuesChange.calls[0].args)
})
