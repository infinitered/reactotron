import {createStore, applyMiddleware, compose} from 'redux'
import Config from '../Config/Config'
import createLogger from 'redux-logger'
import rootReducer from '../Reducers/'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../Sagas/'
import R from 'ramda'
import Reactotron from 'reactotron-react-native'
import createTrackingEnhancer from 'reactotron-redux'
import Types from '../Actions/Types'

// the logger master switch
const USE_LOGGING = Config.sagas.logging
// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']
// creat the logger
const logger = createLogger({
  predicate: (getState, { type }) => USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST)),
  stateTransformer: (state) => R.map((v) => v.asMutable({deep: true}), state)
})

// a function which can create our store and auto-persist the data
export default () => {
  const sagaMiddleware = createSagaMiddleware()
  const tracker = createTrackingEnhancer(Reactotron, {
    except: [Types.STARTUP]
  })
  const enhancers = compose(
    applyMiddleware(logger, sagaMiddleware),
    tracker
  )

  const store = createStore(rootReducer, enhancers)
  sagaMiddleware.run(rootSaga)
  return store
}
