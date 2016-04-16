import ApiSauce from 'apisauce'
import { watchStartup } from './StartupSaga'
import WeatherSaga from './WeatherSaga'
import pp from '../../client'

const api = ApiSauce.create({
  baseURL: 'http://openweathermap.org/data/2.1'
})
api.addMonitor((response) => {
  pp.apiLog(response)
})

const {watchWeatherRequest} = WeatherSaga(api)

// start the daemons
export default [
  watchStartup,
  watchWeatherRequest
]
