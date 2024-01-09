import type { InferFeatures, Reactotron } from "reactotron-core-client"
import type { ReactotronReduxPlugin } from "."

export const defaultReactotronMock: Reactotron &
  InferFeatures<Reactotron, ReactotronReduxPlugin<Reactotron>> = {
  startTimer: jest.fn(),
  configure: jest.fn(),
  close: jest.fn(),
  connect: jest.fn(),
  send: jest.fn(),
  display: jest.fn(),
  use: jest.fn(),
  onCustomCommand: jest.fn(),
  clear: jest.fn(),
  apiResponse: jest.fn(),
  benchmark: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  image: jest.fn(),
  log: jest.fn(),
  logImportant: jest.fn(),
  plugins: [],
  options: {},
  repl: jest.fn(),
  stateActionComplete: jest.fn(),
  stateBackupResponse: jest.fn(),
  stateKeysResponse: jest.fn(),
  stateValuesChange: jest.fn(),
  stateValuesResponse: jest.fn(),
  warn: jest.fn(),
  createEnhancer: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore shhhhhh -- this is a private API
  reduxStore: jest.fn(),
  setReduxStore: jest.fn(),
}
