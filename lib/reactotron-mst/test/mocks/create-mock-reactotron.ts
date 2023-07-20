import { Reactotron } from "reactotron-core-client"
import * as td from "testdouble"

/**
 * Creates a mock reactotron instance with test double functions.
 */
export function createMockReactotron() {
  // just enough of the interface to work
  const reactotron: Reactotron = {
    startTimer: td.func<Reactotron["startTimer"]>(),
    stateValuesChange: td.func<Reactotron["stateValuesChange"]>(),
    send: td.func<Reactotron["send"]>(),
    stateKeysResponse: td.func<Reactotron["stateKeysResponse"]>(),
    stateValuesResponse: td.func<Reactotron["stateValuesResponse"]>(),
    apiResponse: td.func<Reactotron["apiResponse"]>(),
    stateActionComplete: td.func<Reactotron["stateActionComplete"]>(),
    stateBackupResponse: td.func<Reactotron["stateBackupResponse"]>(),
    configure: td.func<Reactotron["configure"]>(),
    close: td.func<Reactotron["close"]>(),
    connect: td.func<Reactotron["connect"]>(),
    display: td.func<Reactotron["display"]>(),
    reportError: td.func<Reactotron["reportError"]>(),
    use: td.func<Reactotron["use"]>(),
    clear: td.func<Reactotron["clear"]>(),
    log: td.func<Reactotron["log"]>(),
    logImportant: td.func<Reactotron["logImportant"]>(),
    benchmark: td.func<Reactotron["benchmark"]>(),
    debug: td.func<Reactotron["debug"]>(),
    error: td.func<Reactotron["error"]>(),
    image: td.func<Reactotron["image"]>(),
    warn: td.func<Reactotron["warn"]>(),
    onCustomCommand: td.func<Reactotron["onCustomCommand"]>(),
    plugins: td.object(),
    options: td.object(),
    repl: td.func<Reactotron["repl"]>(),
  }

  // the timer returns a function that returns 1
  td.when(reactotron.startTimer()).thenReturn(() => 1)

  return reactotron
}
