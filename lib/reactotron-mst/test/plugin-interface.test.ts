import { mst } from "../src/reactotron-mst"
import { createMockReactotron } from "./mocks/create-mock-reactotron"

describe("plugin-interface", () => {
  it("factory interface", () => {
    expect(typeof mst()).toEqual("function")
  })

  it("plugin interface", () => {
    const plugin = mst()(createMockReactotron())

    expect(typeof plugin).toEqual("object")
    expect(typeof plugin.onCommand).toEqual("function")
    expect(typeof plugin.features).toEqual("object")
    expect(typeof plugin.features.trackMstNode).toEqual("function")
  })
})
