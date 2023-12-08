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

    expect(reactotron.stateKeysResponse).toHaveBeenCalledTimes(0)
  })

  it("valid keys", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction(""))

    const stateKeysResponse = reactotron.stateKeysResponse
    expect(stateKeysResponse).toHaveBeenCalledTimes(1)
    const [atPath, keyList] = stateKeysResponse.mock.calls[0]
    expect(atPath).toEqual(null)
    expect(keyList).toEqual(["name", "age"])
  })

  it("invalid key path", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction("does.not.exist"))

    const stateKeysResponse = reactotron.stateKeysResponse
    expect(stateKeysResponse).toHaveBeenCalledTimes(1)
    const [atPath, keyList] = stateKeysResponse.mock.calls[0]
    expect(atPath).toEqual("does.not.exist")
    expect(keyList).toEqual([])
  })
})
