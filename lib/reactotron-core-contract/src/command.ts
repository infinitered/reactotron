import { LogPayload } from "./log"

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

export interface Command<
  Type extends CommandType = CommandType,
  Payload extends Record<string, any> = CommandMap[Type]
> {
  type: CommandType
  connectionId: number
  clientId?: string
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: Payload
}

export interface CommandMap {
  [CommandType.ApiResponse]: any
  [CommandType.AsyncStorageMutation]: any
  [CommandType.Benchmark]: any
  [CommandType.ClientIntro]: any
  [CommandType.Display]: any
  [CommandType.Image]: any
  [CommandType.Log]: LogPayload
  [CommandType.SagaTaskComplete]: any
  [CommandType.StateActionComplete]: any
  [CommandType.StateKeysResponse]: any
  [CommandType.StateValuesChange]: any
  [CommandType.StateValuesResponse]: any
  [CommandType.StateBackupResponse]: any
  [CommandType.CustomCommandRegister]: any
  [CommandType.CustomCommandUnregister]: any
}

export type CommandEvent = (command: Command) => void
