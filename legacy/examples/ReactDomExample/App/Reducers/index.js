import { combineReducers } from 'redux'
import GithubReducer from './GithubReducer'

// glue all the reducers together into 1 root reducer
export default combineReducers({
  github: GithubReducer
})
