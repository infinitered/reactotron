import ApiSauce from 'apisauce'
import { watchStartup } from './StartupSaga'
import WeatherSaga from './WeatherSaga'
import Reactotron from '../../client' // in a real app, you would use 'reactotron'

const api = ApiSauce.create({
  baseURL: 'http://openweathermap.org/data/2.1'
})
api.addMonitor((response) => {
  Reactotron.apiLog(response)
})

const {watchWeatherRequest} = WeatherSaga(api)

// start the daemons
export default [
  watchStartup,
  watchWeatherRequest
]
