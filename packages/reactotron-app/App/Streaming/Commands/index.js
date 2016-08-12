import LogCommand from './LogCommand'
import UnknownCommand from './UnknownCommand'
import StateActionCompleteCommand from './StateActionCompleteCommand'
import ApiResponseCommand from './ApiResponseCommand'
import ClientIntroCommand from './ClientIntroCommand'

export default command => {
  const { type } = command

  switch (type) {
    case 'benchmark.report': return UnknownCommand
    case 'log': return LogCommand
    case 'state.action.complete': return StateActionCompleteCommand
    case 'api.response': return ApiResponseCommand
    case 'client.intro': return ClientIntroCommand
    default: return UnknownCommand
  }
}
