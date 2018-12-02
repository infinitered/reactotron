import test from "ava"
import { types } from "mobx-state-tree"
import * as td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

const UserModel = types.model().props({ name: "", age: 100 })

test("a node is required", t => {
  const { track } = createMstPlugin()
  t.deepEqual({ kind: "required" }, track(null as any))
  t.deepEqual({ kind: "required" }, track(undefined as any))
})

test("only tracks mst nodes", t => {
  const { track } = createMstPlugin()
  t.deepEqual({ kind: "invalid-node" }, track({}))
})

test("checks for dupes", t => {
  const { track } = createMstPlugin()
  t.deepEqual({ kind: "ok" }, track(UserModel.create()))
  t.deepEqual({ kind: "already-tracking" }, track(UserModel.create()))
})

test("no reactotron calls when tracking", t => {
  const { reactotron, track } = createMstPlugin()
  const user = TestUserModel.create()
  track(user)
  t.is(0, td.explain(reactotron.send).callCount)
  t.is(0, td.explain(reactotron.stateValuesChange).callCount)
  t.is(0, td.explain(reactotron.startTimer).callCount)
})
