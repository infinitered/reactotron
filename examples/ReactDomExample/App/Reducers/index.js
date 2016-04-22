import { combineReducers } from 'redux'
import WeatherReducer from './WeatherReducer'

// glue all the reducers together into 1 root reducer
export default combineReducers({
  weather: WeatherReducer
})
