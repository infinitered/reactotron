import { types } from "mobx-state-tree"
import td from "testdouble"
import { TestUserModel, createMstPlugin } from "./fixtures"

const UserModel = types.model().props({ name: "", age: 100 })

describe("sanity", () => {
  it("a node is required", () => {
    const { track } = createMstPlugin()
    expect(track(null as any)).toEqual({ kind: "required" })
    expect(track(undefined as any)).toEqual({ kind: "required" })
  })

  it("only tracks mst nodes", () => {
    const { track } = createMstPlugin()
    expect(track({})).toEqual({ kind: "invalid-node" })
  })

  it("checks for dupes", () => {
    const { track } = createMstPlugin()
    expect(track(UserModel.create())).toEqual({ kind: "ok" })
    expect(track(UserModel.create())).toEqual({ kind: "already-tracking" })
  })

  it("no reactotron calls when tracking", () => {
    const { reactotron, track } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    expect(td.explain(reactotron.send).callCount).toEqual(0)
    expect(td.explain(reactotron.stateValuesChange).callCount).toEqual(0)
    expect(td.explain(reactotron.startTimer).callCount).toEqual(0)
  })
})
