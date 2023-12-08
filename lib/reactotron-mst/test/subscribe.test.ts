import {
  TestUserModel,
  commandMetadataFixture,
  createMstPlugin,
  createTestCompany,
} from "./fixtures"
import type { Command } from "reactotron-core-contract"

function createAction(paths: string[]) {
  return {
    ...commandMetadataFixture,
    type: "state.values.subscribe",
    payload: { paths },
  } satisfies Command<"state.values.subscribe">
}
describe("subscribe", () => {
  it("won't die if we're not tracking nodes", () => {
    const { plugin } = createMstPlugin()
    const action = createAction(["hey"])

    expect(() => plugin.onCommand(action)).not.toThrow()
  })

  it("accepts 1 path", () => {
    const { track, reactotron, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    const action = createAction(["age"])
    track(user)
    plugin.onCommand(action)

    expect(reactotron.stateValuesChange).toHaveBeenCalledTimes(1)
    expect(reactotron.stateValuesChange.mock.calls[0][0]).toEqual([{ path: "age", value: 100 }])
  })

  it("accepts 2 paths", () => {
    const { track, reactotron, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    const action = createAction(["age", "name"])
    track(user)
    plugin.onCommand(action)

    expect(reactotron.stateValuesChange).toHaveBeenCalledTimes(1)
    expect(reactotron.stateValuesChange.mock.calls[0][0]).toEqual([
      { path: "age", value: 100 },
      { path: "name", value: "" },
    ])
  })

  it("ignores dupes", () => {
    const { track, reactotron, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    const action = createAction(["age", "age"])
    track(user)

    plugin.onCommand(action)

    expect(reactotron.stateValuesChange).toHaveBeenCalledTimes(1)
    expect(reactotron.stateValuesChange.mock.calls[0][0]).toEqual([{ path: "age", value: 100 }])
  })

  it("handles missing keys", () => {
    const { track, reactotron, plugin } = createMstPlugin()
    const user = TestUserModel.create()
    const action = createAction(["lol"])
    track(user)
    plugin.onCommand(action)

    expect(reactotron.stateValuesChange).toHaveBeenCalledTimes(1)
    expect(reactotron.stateValuesChange.mock.calls[0][0]).toEqual([
      { path: "lol", value: undefined },
    ])
  })

  it("nested objects", () => {
    const { track, reactotron, plugin } = createMstPlugin()
    const action = createAction(["owner.age"])
    track(createTestCompany())
    plugin.onCommand(action)

    expect(reactotron.stateValuesChange).toHaveBeenCalledTimes(1)
    expect(reactotron.stateValuesChange.mock.calls[0][0]).toEqual([
      { path: "owner.age", value: 100 },
    ])
  })

  it("nested arrays", () => {
    const { track, reactotron, plugin } = createMstPlugin()
    const action = createAction(["employees.1.age"])
    track(createTestCompany())
    plugin.onCommand(action)

    expect(reactotron.stateValuesChange).toHaveBeenCalledTimes(1)
    expect(reactotron.stateValuesChange.mock.calls[0][0]).toEqual([
      { path: "employees.1.age", value: 2 },
    ])
  })
})
