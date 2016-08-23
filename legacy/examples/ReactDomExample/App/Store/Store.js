import { createStore, applyMiddleware, compose } from 'redux'
import Config from '../Config/Config'
import createLogger from 'redux-logger'
import rootReducer from '../Reducers/'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../Sagas/'
import R from 'ramda'
import Reactotron from '../../client'

// the logger master switch
const USE_LOGGING = Config.sagas.logging
// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']
// creat the logger
const logger = createLogger({
  predicate: (getState, { type }) => USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST)),
  stateTransformer: (state) => R.map((v) => v.asMutable({deep: true}), state)
})

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware, Reactotron.reduxMiddleware, logger]

// a function which can create our store and auto-persist the data
export default () => {
  const enhancers = compose(applyMiddleware(...middleware))
  const store = createStore(rootReducer, enhancers)
  sagaMiddleware.run(rootSaga)
  Reactotron.addReduxStore(store)
  return store
}
