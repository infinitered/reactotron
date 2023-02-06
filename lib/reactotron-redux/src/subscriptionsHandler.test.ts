import createSubscriptionHandler from "./subscriptionsHandler"

describe("createSubscriptionHandler", () => {
  describe("sendSubscriptions", () => {
    it("should return an empty array if there are no subscriptions", () => {
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn(),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions([])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([])
    })

    it("should return an array with a single item with all the store if an empty subscription is passed", () => {
      const mockState = { red1: { test: true }, red2: { test: false } }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions([""])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "", value: mockState },
      ])
    })

    it("should return an array with a single item with all the store if an null subscription is passed", () => {
      const mockState = { red1: { test: true }, red2: { test: false } }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions([null])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: null, value: mockState },
      ])
    })

    it("should return an array with a single item with all the store if an * subscription is passed", () => {
      const mockState = { red1: { test: true }, red2: { test: false } }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions(["*"])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "", value: mockState },
      ])
    })

    it("should return an array with a all items in sub items of a * path at the first level", () => {
      const mockState = { red1: { test: true, obj: { nested: true } }, red2: { test: false } }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions(["red1.*"])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "red1.test", value: true },
        { path: "red1.obj", value: { nested: true } },
      ])
    })

    it("should return an array with a all items in sub items of a * path at the second level", () => {
      const mockState = {
        red1: { test: true, obj: { nested: true, anotherItem: 10 } },
        red2: { test: false },
      }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions(["red1.obj.*"])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "red1.obj.nested", value: true },
        { path: "red1.obj.anotherItem", value: 10 },
      ])
    })

    it("should handle multipple subscriptions", () => {
      const mockState = {
        red1: { test: true, obj: { nested: true, anotherItem: 10 } },
        red2: { test: false },
      }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions(["red1.obj.nested", "red1.test"])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "red1.obj.nested", value: true },
        { path: "red1.test", value: true },
      ])
    })

    it("should handle subscription changes", () => {
      const mockState = {
        red1: { test: true, obj: { nested: true, anotherItem: 10 } },
        red2: { test: false },
      }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions(["red1.obj.nested"])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "red1.obj.nested", value: true },
      ])

      handler.setSubscriptions(["red1.test"])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith([
        { path: "red1.test", value: true },
      ])
    })
  })

  describe("sendSubscriptionsIfNeeded", () => {
    it("should not send subscriptions when there are none", () => {
      const mockState = {
        red1: { test: true, obj: { nested: true, anotherItem: 10 } },
        red2: { test: false },
      }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions([])
      handler.sendSubscriptionsIfNeeded()

      expect(mockReactotron.stateValuesChange).not.toHaveBeenCalled()
    })

    it("should send subscriptions when there are at least one", () => {
      const mockState = {
        red1: { test: true, obj: { nested: true, anotherItem: 10 } },
        red2: { test: false },
      }
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn().mockReturnValue(mockState),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn(),
      }

      const handler = createSubscriptionHandler(mockReactotron, () => {})

      handler.setSubscriptions([""])
      handler.sendSubscriptionsIfNeeded()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalled()
    })
  })
})
