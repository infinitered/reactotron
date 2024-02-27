import { configureStore } from "@reduxjs/toolkit"
import type { GetDefaultEnhancers } from "@reduxjs/toolkit/dist/getDefaultEnhancers"
import logoReducer from "../redux/logoSlice"
import repoReducer from "../redux/repoSlice"
import errorReducer from "../redux/errorSlice"

const createEnhancers = (getDefaultEnhancers: GetDefaultEnhancers<any>) => {
  if (__DEV__) {
    const reactotron = require("../devtools/ReactotronConfig").default
    return getDefaultEnhancers().concat(reactotron.createEnhancer())
  } else {
    return getDefaultEnhancers()
  }
}

export const store = configureStore({
  reducer: {
    logo: logoReducer,
    repo: repoReducer,
    error: errorReducer,
  },
  enhancers: createEnhancers,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
