import stateCleaner from "./stateCleaner"

describe("stateCleaner", () => {
  it("should pass the state back if there is nothing special on it", () => {
    const state = { thisIsHere: true }
    const cleanedState = stateCleaner(state)

    expect(cleanedState).toEqual(cleanedState)
  })

  it("should call 'toJS' if it exists on the object to handle immutable", () => {
    const actualState = { thisIsHere: true }
    const state = { toJS: () => actualState }
    const cleanedState = stateCleaner(state)

    expect(cleanedState).toEqual(actualState)
  })
})
