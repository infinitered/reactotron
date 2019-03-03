import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import ReduxThunk from "redux-thunk"
import Reactotron from "reactotron-react-native"

function dummyReducer(state = { counter: 0 }, action) {
  switch(action.type) {
    case "RandomThunkAction":
      return {
        ...state,
        counter: state.counter + 1,
      }
  }

  return state
}

const rootReducer = combineReducers({ dummy: dummyReducer })

const middleware = applyMiddleware(ReduxThunk)

export default () => {
  Reactotron.createSagaMonitor()

  const store = createStore(
    rootReducer,
    compose(
      middleware,
      Reactotron.createEnhancer(),
    ),
  )
  // const store = (Reactotron as any).createStore(rootReducer, compose(middleware))

  return store
}
