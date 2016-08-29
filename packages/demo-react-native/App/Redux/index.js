import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { reducer as repoReducer } from './RepoRedux'
import { reducer as logoReducer } from './LogoRedux'
import { not, contains } from 'ramda'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../Sagas'

// Reactotron Stuff
import Reactotron from 'reactotron-react-native'
import createTrackingEnhancer from 'reactotron-redux'

// make our root reducer
const rootReducer = combineReducers({
  repo: repoReducer,
  logo: logoReducer
})

// the logger master switch
const USE_LOGGING = false

// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']

// create the logger
const logger = createLogger({
  predicate: (getState, { type }) => USE_LOGGING && not(contains(type, SAGA_LOGGING_BLACKLIST))
})

// a function which can create our store and auto-persist the data
export default () => {
  const sagaMiddleware = createSagaMiddleware()
  const tracker = createTrackingEnhancer(Reactotron, {})
  const enhancers = compose(
    tracker,
    applyMiddleware(logger, sagaMiddleware)
  )

  const store = createStore(rootReducer, enhancers)
  sagaMiddleware.run(rootSaga)
  return store
}
