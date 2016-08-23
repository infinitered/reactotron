import { not, contains } from 'ramda'
import {createStore, applyMiddleware, compose} from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './RootReducer'
import rootSaga from '../Sagas'
import Reactotron from 'reactotron-react-js'
import createTronohancer from 'reactotron-redux'
import { Types as LogoTypes } from './Logo.redux'

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
  const tracker = createTronohancer(Reactotron, {
    isActionImportant: action => action.type === LogoTypes.Size && action.size > 100
  })
  const enhancers = compose(
    tracker,
    applyMiddleware(logger, sagaMiddleware)
  )

  const store = createStore(rootReducer, enhancers)
  sagaMiddleware.run(rootSaga)
  return store
}
