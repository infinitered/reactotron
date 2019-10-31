import { FunctionComponent } from "react"

import ApiResponseCommand from "./ApiResponseCommand"
import AsyncStorageMutationCommand from "./AsyncStorageMutationCommand"
import BenchmarkReportCommand from "./BenchmarkReportCommand"
import ClientIntroCommand from "./ClientIntroCommand"
import DisplayCommand from "./DisplayCommand"
import ImageCommand from "./ImageCommand"
import LogCommand from "./LogCommand"
import SagaTaskCompleteCommand from "./SagaTaskCompleteCommand"
import StateActionCompleteCommand from "./StateActionCompleteCommand"
import StateKeysResponseCommand from "./StateKeysResponseCommand"
import StateValuesChangeCommand from "./StateValuesChangeCommand"
import StateValuesResponseCommand from "./StateValuesResponseCommand"
import { TimelineCommandPropsEx } from "./BaseCommand"

enum CommandTypes {
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

function timelineCommandResolver(
  type: CommandTypes
): FunctionComponent<TimelineCommandPropsEx<any>> {
  switch (type) {
    case CommandTypes.ApiResponse:
      return ApiResponseCommand
    case CommandTypes.AsyncStorageMutation:
      return AsyncStorageMutationCommand
    case CommandTypes.Benchmark:
      return BenchmarkReportCommand
    case CommandTypes.ClientIntro:
      return ClientIntroCommand
    case CommandTypes.Display:
      return DisplayCommand
    case CommandTypes.Image:
      return ImageCommand
    case CommandTypes.Log:
      return LogCommand
    case CommandTypes.SagaTaskComplete:
      return SagaTaskCompleteCommand
    case CommandTypes.StateActionComplete:
      return StateActionCompleteCommand
    case CommandTypes.StateKeysResponse:
      return StateKeysResponseCommand
    case CommandTypes.StateValuesChange:
      return StateValuesChangeCommand
    case CommandTypes.StateValuesResponse:
      return StateValuesResponseCommand
    default:
      return null
  }
}

export default timelineCommandResolver
