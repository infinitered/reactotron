import { Dimensions } from "react-native"
import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  compose,
  Action,
} from "redux"
import ReduxThunk from "redux-thunk"
import Reactotron from "reactotron-react-native"

function dummyReducer(state = { counter: 0 }, action: Action) {
  switch (action.type) {
    case "RandomThunkAction":
      return {
        ...state,
        counter: state.counter + 1,
        height: Dimensions.get("screen").height,
      }
    default:
      return {
        ...state,
      }
  }

  return state
}

const rootReducer = combineReducers({ dummy: dummyReducer })

const middleware = applyMiddleware(ReduxThunk)

const store = createStore(
  rootReducer,
  compose(middleware, Reactotron.createEnhancer?.()!),
)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default () => {
  Reactotron.createSagaMonitor?.()

  // const store = (Reactotron as any).createStore(rootReducer, compose(middleware))

  return store
}
