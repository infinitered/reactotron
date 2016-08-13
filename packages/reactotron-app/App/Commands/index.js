import LogCommand from './LogCommand'
import UnknownCommand from './UnknownCommand'
import StateActionCompleteCommand from './StateActionCompleteCommand'
import ApiResponseCommand from './ApiResponseCommand'
import ClientIntroCommand from './ClientIntroCommand'
import BenchmarkReportCommand from './BenchmarkReportCommand'
import StateValuesResponseCommand from './StateValuesResponseCommand'

export default command => {
  const { type } = command

  switch (type) {
    case 'benchmark.report': return BenchmarkReportCommand
    case 'log': return LogCommand
    case 'state.action.complete': return StateActionCompleteCommand
    case 'api.response': return ApiResponseCommand
    case 'client.intro': return ClientIntroCommand
    case 'state.values.response': return StateValuesResponseCommand
    default: return UnknownCommand
  }
}
