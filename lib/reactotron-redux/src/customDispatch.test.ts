import createCustomDispatch from "./customDispatch"
import { DEFAULT_REPLACER_TYPE } from "./reducer"

describe("customDispatch", () => {
  it("should send an action to reactotron", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "Any Type",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {})

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, false)
  })

  it.todo("should handle 'PERFORM_ACTION' actions correctly")

  it("should respect the exclude list and not send an item off of it if it is a string", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "IGNORE_ME",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      except: ["IGNORE_ME"],
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).not.toHaveBeenCalled()
  })

  it("should respect the exclude list and not send an item off of it if it is a function", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "IGNORE_ME",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      except: [(actionType: string) => actionType.startsWith("IGNORE")],
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).not.toHaveBeenCalled()
  })

  it("should respect the exclude list and send an item off of it if it is a function", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "DONT_IGNORE_ME",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      except: [(actionType: string) => actionType.startsWith("IGNORE")],
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, false)
  })

  it("should respect the exclude list and not send an item off of it if it is a regex", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "IGNORE_ME",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      except: [/[A-Z]/],
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).not.toHaveBeenCalled()
  })

  it("should respect the exclude list and send an item off of it if it is a regex", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "1234",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      except: [/[A-Z]/],
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, false)
  })

  it("should respect the exclude list and should still send items not on the list", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "DONT_IGNORE_ME",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      except: ["IGNORE_ME"],
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, false)
  })

  it("should exclude the restoreActionType by default", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: DEFAULT_REPLACER_TYPE,
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).not.toHaveBeenCalled()
  })

  it("should call isActionImportant and mark the action as important if it returns true", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "MAKE_ME_IMPORTANT",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      isActionImportant: action => action.type === "MAKE_ME_IMPORTANT",
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, true)
  })

  it("should call isActionImportant and mark the action as important if it returns false", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "MAKE_ME_NOT_MPORTANT",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {
      restoreActionType: DEFAULT_REPLACER_TYPE,
      isActionImportant: action => action.type === "MAKE_ME_IMPORTANT",
    })

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, false)
  })
})
