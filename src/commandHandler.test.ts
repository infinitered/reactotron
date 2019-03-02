import createCommandHandler from "./commandHandler"
import { DEFAULT_REPLACER_TYPE } from "./reducer"
import { PluginConfig } from "./pluginConfig"

// TODO: Write more tests around onBackup and onRestore.

const defaultPluginConfig: PluginConfig = {
  restoreActionType: DEFAULT_REPLACER_TYPE,
  onBackup: (state: any) => state,
  onRestore: (restoringState: any) => restoringState,
}

describe("commandHandler", () => {
  it("should create a function when called", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: true } }),
        subscribe: jest.fn()
      },
      stateKeysResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    expect(typeof commandHandler).toEqual("function")
  })

  it("should handle a 'state.keys.request' command type for no path", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: true } }),
        subscribe: jest.fn()
      },
      stateKeysResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.keys.request", payload: { path: "" } })

    expect(reactotronMock.stateKeysResponse).toHaveBeenCalledWith(null, ["topLevel"])
  })

  it("should handle a 'state.keys.request' command type for a single level", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: true } }),
        subscribe: jest.fn()
      },
      stateKeysResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.keys.request", payload: { path: "topLevel" } })

    expect(reactotronMock.stateKeysResponse).toHaveBeenCalledWith("topLevel", ["here"])
  })

  it("should handle a 'state.keys.request' command type for two levels", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: { nested: true } } }),
        subscribe: jest.fn()
      },
      stateKeysResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.keys.request", payload: { path: "topLevel.here" } })

    expect(reactotronMock.stateKeysResponse).toHaveBeenCalledWith("topLevel.here", ["nested"])
  })

  it("should handle a 'state.keys.request' command type for a path that isn't an object", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: { nested: true } } }),
        subscribe: jest.fn()
      },
      stateKeysResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.keys.request", payload: { path: "topLevel.here.nested" } })

    expect(reactotronMock.stateKeysResponse).toHaveBeenCalledWith("topLevel.here.nested", undefined)
  })

  it("should handle a 'state.keys.request' command type for a path that is invalid", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: { nested: true } } }),
        subscribe: jest.fn()
      },
      stateKeysResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.keys.request", payload: { path: "topLevel2.here.nested" } })

    expect(reactotronMock.stateKeysResponse).toHaveBeenCalledWith("topLevel2.here.nested", undefined)
  })

  it("should handle a 'state.values.request' command type for a single level", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: true } }),
        subscribe: jest.fn()
      },
      stateValuesResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.values.request", payload: { path: "topLevel" } })

    expect(reactotronMock.stateValuesResponse).toHaveBeenCalledWith("topLevel", { here: true })
  })

  it("should handle a 'state.values.request' command type for two levels", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: { nested: true } } }),
        subscribe: jest.fn()
      },
      stateValuesResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.values.request", payload: { path: "topLevel.here" } })

    expect(reactotronMock.stateValuesResponse).toHaveBeenCalledWith("topLevel.here", { nested: true })
  })

  it("should handle a 'state.values.request' command type for a path that isn't an object", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: { nested: true } } }),
        subscribe: jest.fn()
      },
      stateValuesResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.values.request", payload: { path: "topLevel.here.nested" } })

    expect(reactotronMock.stateValuesResponse).toHaveBeenCalledWith("topLevel.here.nested", true)
  })

  it("should handle a 'state.values.request' command type for a path that is invalid", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ topLevel: { here: { nested: true } } }),
        subscribe: jest.fn()
      },
      stateValuesResponse: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.values.request", payload: { path: "topLevel2.here.nested" } })

    expect(reactotronMock.stateValuesResponse).toHaveBeenCalledWith("topLevel2.here.nested", undefined)
  })

  it.todo("should handle a 'state.values.subscribe' command type")

  it("should handle a 'state.action.dispatch' command type", () => {
    const reactotronMock = {
      reduxStore: {
        dispatch: jest.fn(),
        subscribe: jest.fn()
      },
    }
    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.action.dispatch", payload: { action: { type: "Do a thing." } } })

    expect(reactotronMock.reduxStore.dispatch).toHaveBeenCalledWith({ type: "Do a thing." })
  })

  it("should handle a 'state.backup.request' command type", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ myState: true }),
        subscribe: jest.fn()
      },
      send: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.backup.request" })

    expect(reactotronMock.reduxStore.getState).toHaveBeenCalledTimes(1)
    expect(reactotronMock.send).toHaveBeenCalledWith("state.backup.response", {
      state: { myState: true },
    })
  })

  it("should handle a 'state.restore.request' command type", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn(),
        dispatch: jest.fn(),
        subscribe: jest.fn()
      },
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig, () => {})

    commandHandler({ type: "state.restore.request", payload: { state: { myReplacedState: true } } })

    expect(reactotronMock.reduxStore.dispatch).toHaveBeenCalledWith({
      type: DEFAULT_REPLACER_TYPE,
      state: { myReplacedState: true },
    })
  })
})
