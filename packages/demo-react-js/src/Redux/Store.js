import { not, contains } from 'ramda'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './RootReducer'
import rootSaga from '../Sagas'

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
  // create the saga middleware
  const sagaMonitor = process.env.NODE_ENV !== 'production'
    ? console.tron.createSagaMonitor()
    : null
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })

  // add our normal middleware to the list
  const middleware = applyMiddleware(logger, sagaMiddleware)

  // create the store with a root reducer & a composed list of enhancers
  const store = process.env.NODE_ENV === 'production'
    ? createStore(rootReducer, middleware)
    : console.tron.createStore(rootReducer, middleware)

  // kick off the root saga
  sagaMiddleware.run(rootSaga)

  return store
}
