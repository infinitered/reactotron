import { type Reactotron } from "reactotron-core-client"

/**
 * Creates a mock reactotron instance with test double functions.
 */
export function createMockReactotron() {
  // just enough of the interface to work
  const reactotron = {
    startTimer: jest.fn<Reactotron["startTimer"], Parameters<Reactotron["startTimer"]>, Reactotron>(
      () => () => () => 1
    ),
    stateValuesChange: jest.fn<
      Reactotron["stateValuesChange"],
      Parameters<Reactotron["stateValuesChange"]>
    >(),
    send: jest.fn<Reactotron["send"], Parameters<Reactotron["send"]>, Reactotron>(),
    stateKeysResponse: jest.fn<
      Reactotron["stateKeysResponse"],
      Parameters<Reactotron["stateKeysResponse"]>,
      Reactotron
    >(),
    stateValuesResponse: jest.fn<
      Reactotron["stateValuesResponse"],
      Parameters<Reactotron["stateValuesResponse"]>,
      Reactotron
    >(),
    apiResponse: jest.fn<
      Reactotron["apiResponse"],
      Parameters<Reactotron["apiResponse"]>,
      Reactotron
    >(),
    stateActionComplete: jest.fn<
      Reactotron["stateActionComplete"],
      Parameters<Reactotron["stateActionComplete"]>,
      Reactotron
    >(),
    stateBackupResponse: jest.fn<
      Reactotron["stateBackupResponse"],
      Parameters<Reactotron["stateBackupResponse"]>,
      Reactotron
    >(),
    configure: jest.fn<Reactotron["configure"], Parameters<Reactotron["configure"]>, Reactotron>(),
    close: jest.fn<Reactotron["close"], Parameters<Reactotron["close"]>, Reactotron>(),
    connect: jest.fn<Reactotron["connect"], Parameters<Reactotron["connect"]>, Reactotron>(),
    display: jest.fn<Reactotron["display"], Parameters<Reactotron["display"]>, Reactotron>(),
    use: jest.fn<Reactotron["use"], Parameters<Reactotron["use"]>, Reactotron>(),
    clear: jest.fn<Reactotron["clear"], Parameters<Reactotron["clear"]>, Reactotron>(),
    log: jest.fn<Reactotron["log"], Parameters<Reactotron["log"]>, Reactotron>(),
    logImportant: jest.fn<
      Reactotron["logImportant"],
      Parameters<Reactotron["logImportant"]>,
      Reactotron
    >(),
    benchmark: jest.fn<Reactotron["benchmark"], Parameters<Reactotron["benchmark"]>, Reactotron>(),
    debug: jest.fn<Reactotron["debug"], Parameters<Reactotron["debug"]>, Reactotron>(),
    error: jest.fn<Reactotron["error"], Parameters<Reactotron["error"]>, Reactotron>(),
    image: jest.fn<Reactotron["image"], Parameters<Reactotron["image"]>, Reactotron>(),
    warn: jest.fn<Reactotron["warn"], Parameters<Reactotron["warn"]>, Reactotron>(),
    onCustomCommand: jest.fn<
      Reactotron["onCustomCommand"],
      Parameters<Reactotron["onCustomCommand"]>,
      Reactotron
    >(),
    plugins: [],
    options: {},
    repl: jest.fn<Reactotron["repl"], Parameters<Reactotron["repl"]>, Reactotron>(),
  } satisfies Record<keyof Reactotron, Reactotron[keyof Reactotron]>
  return reactotron
}
