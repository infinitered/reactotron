import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {reducer as repoReducer} from './RepoRedux';
import {reducer as logoReducer} from './LogoRedux';
import {reducer as errorReducer} from './ErrorRedux';
import {not, contains} from 'ramda';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../Sagas';

// Reactotron Stuff
import Reactotron from 'reactotron-react-native';

// make our root reducer
const rootReducer = combineReducers({
  repo: repoReducer,
  logo: logoReducer,
  error: errorReducer,
});

// the logger master switch
const USE_LOGGING = false;

// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = [
  'EFFECT_TRIGGERED',
  'EFFECT_RESOLVED',
  'EFFECT_REJECTED',
];

// create the logger
const logger = createLogger({
  predicate: (getState, {type}) =>
    USE_LOGGING && not(contains(type, SAGA_LOGGING_BLACKLIST)),
});

// a function which can create our store and auto-persist the data
export default () => {
  const sagaMiddleware = createSagaMiddleware({
    sagaMonitor: Reactotron.createSagaMonitor(),
  });
  const middleware = applyMiddleware(logger, sagaMiddleware);
  const store = createStore(
    rootReducer,
    compose(middleware, Reactotron.createEnhancer()),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
