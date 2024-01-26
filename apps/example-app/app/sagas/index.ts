import { all, takeEvery, takeLatest } from "redux-saga/effects"
import * as Startup from "app/redux/StartupRedux"
import * as Repo from "app/redux/RepoRedux"
import * as Error from "app/redux/ErrorRedux"
import { startup } from "./StartupSagas"
import { request as requestRepo } from "./RepoSagas"
import { sagaError, putError } from "./ErrorSagas"
import ApiSauce from "apisauce"

import Reactotron from "reactotron-react-native"

const api = ApiSauce.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
})

if (__DEV__) {
  api.addMonitor(Reactotron.apisauce)
}

export default function* rootSaga() {
  yield all([
    takeEvery(Startup.Types.Startup, startup),
    takeLatest(Repo.Types.Request, requestRepo, api),
    takeEvery(Error.Types.Saga, sagaError),
    takeEvery(Error.Types.Put, putError),
  ])
}
