import { combineReducers } from 'redux'
import { reducer as repoMessageReducer } from './RepoMessage.redux'

export default combineReducers({
  repoMessage: repoMessageReducer
})
