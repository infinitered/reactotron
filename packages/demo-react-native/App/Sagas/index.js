import { fork } from 'redux-saga/effects'
import ApiSauce from 'apisauce'
import { watchStartup } from './StartupSaga'
import WeatherSaga from './WeatherSaga'
import Reactotron from 'reactotron-react-native'

const api = ApiSauce.create({
  baseURL: 'http://openweathermap.org/data/2.1'
})

api.addMonitor(Reactotron.apisauce)

export default function * rootSaga () {
  yield fork(watchStartup)
  yield fork(WeatherSaga(api).watchWeatherRequest)
}
