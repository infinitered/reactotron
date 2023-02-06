import reducer, { DEFAULT_REPLACER_TYPE } from "./reducer"

describe("reducer", () => {
  it("should do nothing if it isn't the special type", () => {
    const rootReducer = jest.fn()

    const reactotronReducer = reducer(rootReducer)

    reactotronReducer({ myState: true }, { type: "Not The Special Type" })

    expect(rootReducer).toHaveBeenCalledWith({ myState: true }, { type: "Not The Special Type" })
  })

  it("should return the root reducers result if the special action isn't passed", () => {
    function rootReducer(state: any, action: any) {
      return {
        ...state,
        lastAction: action,
      }
    }

    const reactotronReducer = reducer(rootReducer)

    const result = reactotronReducer({ myState: true }, { type: "Not The Special Type" })

    expect(result).toEqual({
      myState: true,
      lastAction: {
        type: "Not The Special Type",
      },
    })
  })

  it("should still call the root reducer if the special action is called", () => {
    const rootReducer = jest.fn()

    const reactotronReducer = reducer(rootReducer)

    reactotronReducer({ myState: true }, { type: DEFAULT_REPLACER_TYPE, state: { myState: true } })

    expect(rootReducer).toHaveBeenCalledWith(
      { myState: true },
      { type: DEFAULT_REPLACER_TYPE, state: { myState: true } }
    )
  })

  it("should replace the state if the special action is called", () => {
    const rootReducer = jest.fn()

    const reactotronReducer = reducer(rootReducer)

    reactotronReducer(
      { myState: true },
      { type: DEFAULT_REPLACER_TYPE, state: { myNewState: true } }
    )

    expect(rootReducer).toHaveBeenCalledWith(
      { myNewState: true },
      { type: DEFAULT_REPLACER_TYPE, state: { myNewState: true } }
    )
  })
})
