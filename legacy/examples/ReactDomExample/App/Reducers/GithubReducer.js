import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import createReducer from './CreateReducer'

export const INITIAL_STATE = Immutable({
  message: null,
  fetching: false,
  error: null
})

const request = (state, action) =>
  state.merge({ fetching: true, message: null, error: null })

const receive = (state, action) =>
  state.merge({
    fetching: false,
    error: null,
    message: action.message
  })

const failure = (state, action) =>
  state.merge({
    fetching: false,
    error: true,
    message: null
  })

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.GITHUB_REQUEST]: request,
  [Types.GITHUB_RECEIVE]: receive,
  [Types.GITHUB_FAILURE]: failure
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
