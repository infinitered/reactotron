import * as td from "testdouble"

/**
 * Creates a mock reactotron instance with test double functions.
 */
export function createMockReactotron() {
  // just enough of the interface to work
  const reactotron = {
    startTimer: td.func(),
    stateValuesChange: td.func(),
    send: td.func(),
    stateKeysResponse: td.func(),
    stateValuesResponse: td.func(),
  }

  // the timer returns a function that returns 1
  td.when(reactotron.startTimer()).thenReturn(() => 1)

  return reactotron
}
