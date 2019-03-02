import createEnhancer from "./enhancer"

// TODO: More testing

describe("enhancer", () => {
  it("should return a function", () => {
    const enhancer = createEnhancer(null, {}, () => {})

    expect(typeof enhancer).toEqual("function")
  })
})
