import LogCommand from './LogCommand'
import UnknownCommand from './UnknownCommand'
import StateActionCompleteCommand from './StateActionCompleteCommand'
import ApiResponseCommand from './ApiResponseCommand'
import ClientIntroCommand from './ClientIntroCommand'
import BenchmarkReportCommand from './BenchmarkReportCommand'
import StateValuesResponseCommand from './StateValuesResponseCommand'
import StateKeysResponseCommand from './StateKeysResponseCommand'
import StateValuesChangeCommand from './StateValuesChangeCommand'
import DisplayCommand from './DisplayCommand'
import ImageCommand from './ImageCommand'

export default command => {
  const { type } = command

  switch (type) {
    case 'benchmark.report': return BenchmarkReportCommand
    case 'log': return LogCommand
    case 'state.action.complete': return StateActionCompleteCommand
    case 'api.response': return ApiResponseCommand
    case 'client.intro': return ClientIntroCommand
    case 'state.values.response': return StateValuesResponseCommand
    case 'state.keys.response': return StateKeysResponseCommand
    case 'state.values.change': return StateValuesChangeCommand
    case 'display': return DisplayCommand
    case 'image': return ImageCommand
    default: return UnknownCommand
  }
}
