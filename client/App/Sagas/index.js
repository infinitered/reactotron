import ApiSauce from 'apisauce'

import { watchStartup } from './StartupSaga'
import WeatherSaga from './WeatherSaga'

const api = ApiSauce.create({
  baseURL: 'http://openweathermap.org/data/2.1'
})

const {watchWeatherRequest} = WeatherSaga(api)

// start the daemons
export default [
  watchStartup,
  watchWeatherRequest
]
