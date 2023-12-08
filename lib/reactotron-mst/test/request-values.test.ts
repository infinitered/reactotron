import { TestUserModel, commandMetadataFixture, createMstPlugin } from "./fixtures"
import type { Command } from "reactotron-core-contract"

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

    expect(reactotron.stateValuesResponse).toHaveBeenCalledTimes(0)
  })

  it("valid values", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction(""))

    const stateValuesResponse = reactotron.stateValuesResponse
    expect(stateValuesResponse).toHaveBeenCalled()
    const [atPath, keyList] = stateValuesResponse.mock.calls[0]
    expect(atPath).toBeNull()
    expect(keyList).toEqual({ name: "", age: 100 })
  })

  it("invalid key path", () => {
    const { reactotron, track, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    track(user)
    plugin.onCommand(createAction("does.not.exist"))

    const stateValuesResponse = reactotron.stateValuesResponse
    expect(stateValuesResponse).toHaveBeenCalled()
    const [atPath, values] = stateValuesResponse.mock.calls[0]
    expect(atPath).toEqual("does.not.exist")
    expect(values).toBeUndefined()
  })
})
