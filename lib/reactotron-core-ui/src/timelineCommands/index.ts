import { FunctionComponent } from "react"

import { CommandType } from "reactotron-core-contract"
import type { CommandTypeKey } from "reactotron-core-contract"

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

function timelineCommandResolver(
  type: CommandTypeKey
): FunctionComponent<TimelineCommandPropsEx<any>> {
  switch (type) {
    case CommandType.ApiResponse:
      return ApiResponseCommand
    case CommandType.AsyncStorageMutation:
      return AsyncStorageMutationCommand
    case CommandType.Benchmark:
      return BenchmarkReportCommand
    case CommandType.ClientIntro:
      return ClientIntroCommand
    case CommandType.Display:
      return DisplayCommand
    case CommandType.Image:
      return ImageCommand
    case CommandType.Log:
      return LogCommand
    case CommandType.SagaTaskComplete:
      return SagaTaskCompleteCommand
    case CommandType.StateActionComplete:
      return StateActionCompleteCommand
    case CommandType.StateKeysResponse:
      return StateKeysResponseCommand
    case CommandType.StateValuesChange:
      return StateValuesChangeCommand
    case CommandType.StateValuesResponse:
      return StateValuesResponseCommand
    default:
      return null
  }
}

export default timelineCommandResolver
