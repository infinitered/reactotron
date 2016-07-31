import { take, call, put } from 'redux-saga/effects'
import RS from 'ramdasauce'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'
import Reactotron from 'reactotron-react-native'

const SCALE = 'C'

export function * getWeather (api, city) {
  const elapsed = Reactotron.startTimer()
  // const bench = Reactotron.bench('weather check')
  const response = yield call(api.get, '/find/name', { q: city })
  Reactotron.log(`api call took ${elapsed()} ms`)
  // bench.step('after api')
  if (response.ok) {
    const kelvin = RS.dotPath('data.list.0.main.temp', response)
    const celcius = kelvin - 273.15
    const farenheit = (celcius * 1.8000) + 32

    // bench.step('after mathy things')
    if (SCALE === 'F') {
      yield put(Actions.receiveTemperature(Math.round(farenheit)))
    } else {
      yield put(Actions.receiveTemperature(Math.round(celcius)))
    }
  } else {
    yield put(Actions.receiveTemperatureFailure())
  }
  // bench.stop()
}

export default (api) => {
  function * watchWeatherRequest () {
    while (true) {
      const action = yield take(Types.TEMPERATURE_REQUEST)
      const { city } = action
      yield call(getWeather, api, city)
    }
  }

  return {
    watchWeatherRequest
  }
}
