import ApiSauce from 'apisauce'
import { watchStartup } from './StartupSaga'
import WeatherSaga from './WeatherSaga'
import repl from '../../client'

const api = ApiSauce.create({
  baseURL: 'http://openweathermap.org/data/2.1'
})
api.addMonitor((response) => {
  if (response.config) {
    repl.log(`[API] - ${response.ok} - ${response.status}`)
  } else {
    repl.log(`[API] - ${response.problem}`)
  }
})

const {watchWeatherRequest} = WeatherSaga(api)

// start the daemons
export default [
  watchStartup,
  watchWeatherRequest
]
