import td from "testdouble"
import { TestUserModel, createMstPlugin, commandMetadataFixture } from "./fixtures"
import type { Command } from "reactotron-core-contract"

function createAction(path: string) {
  return {
    ...commandMetadataFixture,
    type: "state.keys.request",
    payload: { path },
  } satisfies Command<"state.keys.request">
}

describe("request-keys", () => {
  it("won't die if we're not tracking nodes", () => {
    const { reactotron, plugin } = createMstPlugin()
    plugin.onCommand(createAction(""))

    expect(td.explain(reactotron.stateKeysResponse).callCount).toEqual(0)
  })

  it("valid keys", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction(""))

    const stateKeysResponse = td.explain(reactotron.stateKeysResponse)
    expect(stateKeysResponse.callCount).toEqual(1)
    const [atPath, keyList] = stateKeysResponse.calls[0].args
    expect(atPath).toEqual(null)
    expect(keyList).toEqual(["name", "age"])
  })

  it("invalid key path", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction("does.not.exist"))

    const stateKeysResponse = td.explain(reactotron.stateKeysResponse)
    expect(stateKeysResponse.callCount).toEqual(1)
    const [atPath, keyList] = stateKeysResponse.calls[0].args
    expect(atPath).toEqual("does.not.exist")
    expect(keyList).toEqual([])
  })
})
