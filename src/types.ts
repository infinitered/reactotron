export enum CommandType {
  ApiResponse = "api.response",
  AsyncStorageMutation = "asyncStorage.mutation",
  Benchmark = "benchmark.report",
  ClientIntro = "client.intro",
  Display = "display",
  Image = "image",
  Log = "log",
  SagaTaskComplete = "saga.task.complete",
  StateActionComplete = "state.action.complete",
  StateKeysResponse = "state.keys.response",
  StateValuesChange = "state.values.change",
  StateValuesResponse = "state.values.response",
}
