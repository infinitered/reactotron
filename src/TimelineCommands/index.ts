import { FunctionComponent } from "react"

import ApiResponseCommand from "./ApiResponseCommand"
import AsyncStorageMutationCommand from "./AsyncStorageMutationCommand"
import BenchmarkReportCommand from "./BenchmarkReportCommand"
import ClientIntroCommand from "./ClientIntroCommand"
import DisplayCommand from "./DisplayCommand"
import ImageCommand from "./ImageCommand"
import SagaTaskCompleteCommand from "./SagaTaskCompleteCommand"
import StateActionCompleteCommand from "./StateActionCompleteCommand"
import { TimelineCommandProps } from "./BaseCommand"

enum CommandTypes {
  ApiResponse = "api.response",
  AsyncStorageMutation = "asyncStorage.mutation",
  Benchmark = "benchmark.report",
  ClientIntro = "client.intro",
  Display = "display",
  Image = "image",
  SagaTaskComplete = "saga.task.complete",
  StateActionComplete = "state.action.complete",
}

function timelineCommandResolver(type: CommandTypes): FunctionComponent<TimelineCommandProps<any>> {
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
    case CommandTypes.SagaTaskComplete:
      return SagaTaskCompleteCommand
    case CommandTypes.StateActionComplete:
      return StateActionCompleteCommand
    default:
      return null
  }
}

export default timelineCommandResolver
