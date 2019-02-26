import { mst } from "../src/reactotron-mst"

describe("plugin-interface", () => {
  it("factory interface", () => {
    expect(typeof mst()).toEqual("function")
  })

  it("plugin interface", () => {
    const plugin = mst()({})

    expect(typeof plugin).toEqual("object")
    expect(typeof plugin.onCommand).toEqual("function")
    expect(typeof plugin.features).toEqual("object")
    expect(typeof plugin.features.trackMstNode).toEqual("function")
  })
})
