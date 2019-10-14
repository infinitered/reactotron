import ApiResponseCommand from "./ApiResponseCommand"
import ClientIntroCommand from "./ClientIntroCommand"
import StateActionCompleteCommand from "./StateActionCompleteCommand"

enum CommandTypes {
  ApiResponse = "api.response",
  ClientIntro = "client.intro",
  StateActionComplete = "state.action.complete",
}

function timelineCommandResolver(type: CommandTypes) {
  switch (type) {
    case CommandTypes.ApiResponse:
      return ApiResponseCommand
    case CommandTypes.ClientIntro:
      return ClientIntroCommand
    case CommandTypes.StateActionComplete:
      return StateActionCompleteCommand
    default:
      return null
  }
}

export default timelineCommandResolver
