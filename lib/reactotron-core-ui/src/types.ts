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
  StateBackupResponse = "state.backup.response",
  CustomCommandRegister = "customCommand.register",
  CustomCommandUnregister = "customCommand.unregister",
}

export interface Command {
  id: number
  type: CommandType
  connectionId: number
  clientId?: string
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: any
}
