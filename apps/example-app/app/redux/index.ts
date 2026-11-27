import { configureStore } from "@reduxjs/toolkit"
import logoReducer from "../redux/logoSlice"
import repoReducer from "../redux/repoSlice"
import errorReducer from "../redux/errorSlice"
// REDACTION TEST
import redactionTestReducer from "../redux/redactionSlice"

export const store = configureStore({
  reducer: {
    logo: logoReducer,
    repo: repoReducer,
    error: errorReducer,
    // REDACTION TEST
    redactionTest: redactionTestReducer,
  },
  enhancers: (getDefaultEnhancers) => {
    if (__DEV__) {
      const reactotron = require("../devtools/ReactotronConfig").default
      return getDefaultEnhancers().concat(reactotron.createEnhancer())
    }
    return getDefaultEnhancers()
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
