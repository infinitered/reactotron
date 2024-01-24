import { combineReducers } from "redux"
import { reducer as repoReducer } from "./RepoRedux"
import { reducer as logoReducer } from "./LogoRedux"
import { reducer as errorReducer } from "./ErrorRedux"
import { not, includes } from "ramda"
import { createLogger } from "redux-logger"
import createSagaMiddleware from "redux-saga"
import { configureStore } from "@reduxjs/toolkit"
import { Reactotron } from "../devtools/ReactotronClient"
import rootSaga from "../sagas"

// make our root reducer
const rootReducer = combineReducers({
  repo: repoReducer,
  logo: logoReducer,
  error: errorReducer,
})

// the logger master switch
const USE_LOGGING = false

// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ["EFFECT_TRIGGERED", "EFFECT_RESOLVED", "EFFECT_REJECTED"]

// create the logger
const logger = createLogger({
  predicate: (getState, { type }) => USE_LOGGING && not(includes(type, SAGA_LOGGING_BLACKLIST)),
})

// a function which can create our store and auto-persist the data
export default () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logger, sagaMiddleware],
    enhancers: (getDefaultEnhancers) =>
      __DEV__
        ? [...getDefaultEnhancers(), Reactotron.createEnhancer()]
        : [...getDefaultEnhancers()],
  })

  sagaMiddleware.run(rootSaga)
  return store
}
