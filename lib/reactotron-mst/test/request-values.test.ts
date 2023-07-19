import * as td from "testdouble"
import { TestUserModel, commandMetadataFixture, createMstPlugin } from "./fixtures"
import { Command } from "reactotron-core-contract"

function createAction(path: string) {
  return {
    ...commandMetadataFixture,
    type: "state.values.request",
    payload: { path },
  } satisfies Command<"state.values.request">
}

describe("request-values", () => {
  it("won't die if we're not tracking nodes", () => {
    const { reactotron, plugin } = createMstPlugin()
    plugin.onCommand(createAction(""))

    expect(td.explain(reactotron.stateValuesResponse).callCount).toEqual(0)
  })

  it("valid values", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction(""))

    const stateValuesResponse = td.explain(reactotron.stateValuesResponse)
    expect(stateValuesResponse.callCount).toEqual(1)
    const [atPath, keyList] = stateValuesResponse.calls[0].args
    expect(atPath).toEqual(null)
    expect(keyList).toEqual({ name: "", age: 100 })
  })

  it("invalid key path", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction("does.not.exist"))

    const stateValuesResponse = td.explain(reactotron.stateValuesResponse)
    expect(stateValuesResponse.callCount).toEqual(1)
    const [atPath, values] = stateValuesResponse.calls[0].args
    expect(atPath).toEqual("does.not.exist")
    expect(values).toEqual(undefined)
  })
})
