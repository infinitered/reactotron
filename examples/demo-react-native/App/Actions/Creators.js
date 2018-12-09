import createAction from './CreateAction'
import Types from './Types'

const startup = () => createAction(Types.STARTUP)
const requestTemperature = city => createAction(Types.TEMPERATURE_REQUEST, { city })
const receiveTemperature = temperature => createAction(Types.TEMPERATURE_RECEIVE, { temperature })
const receiveTemperatureFailure = () => createAction(Types.TEMPERATURE_FAILURE)

/**
 Makes available all the action creators we've created.
 */
export default {
  startup,
  requestTemperature,
  receiveTemperature,
  receiveTemperatureFailure
}
