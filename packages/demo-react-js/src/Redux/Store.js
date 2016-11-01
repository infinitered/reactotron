import { not, contains } from 'ramda'
import {createStore, applyMiddleware, compose} from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './RootReducer'
import rootSaga from '../Sagas'
import { Types as LogoTypes } from './Logo.redux'
const Reactotron = process.env.NODE_ENV !== 'production' && require('reactotron-react-js').default
const {
  createReactotronStoreEnhancer,
  createReplacementReducer
} = process.env.NODE_ENV !== 'production' && require('reactotron-redux')

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
  const sagaMiddleware = createSagaMiddleware()

  // setup an array to place our enhancers
  const enhancers = []

  // unless we're in production, add the Reactotron enhancer to the list
  if (process.env.NODE_ENV !== 'production') {
    const reactotronEnhancer = createReactotronStoreEnhancer(Reactotron, {
      isActionImportant: action => action.type === LogoTypes.Size && action.size > 100
    })
    enhancers.push(reactotronEnhancer)
  }

  // add our normal middleware to the list
  enhancers.push(applyMiddleware(logger, sagaMiddleware))

  // in dev, we'll wrap our root reducer with one that can replace the state remotely
  const reducerToUse = process.env.NODE_ENV !== 'production'
    ? createReplacementReducer(rootReducer)
    : rootReducer

  // create the store with a root reducer & a composed list of enhancers
  const store = createStore(reducerToUse, compose(...enhancers))

  // kick off the root saga
  sagaMiddleware.run(rootSaga)

  return store
}
