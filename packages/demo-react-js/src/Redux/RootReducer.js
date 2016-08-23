import { combineReducers } from 'redux'
import { reducer as repoReducer } from './Repo.redux'
import { reducer as logoReducer } from './Logo.redux'

export default combineReducers({
  repo: repoReducer,
  logo: logoReducer
})
