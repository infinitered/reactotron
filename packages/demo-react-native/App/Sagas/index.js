import { takeEvery, takeLatest } from 'redux-saga'
import * as Startup from '../Redux/StartupRedux'
import * as Repo from '../Redux/RepoRedux'
import { startup } from './StartupSagas'
import { request as requestRepo } from './RepoSagas'
import ApiSauce from 'apisauce'

import Reactotron from 'reactotron-react-native'

const api = ApiSauce.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
})

api.addMonitor(Reactotron.apisauce)

export default function * rootSaga () {
  yield [
    takeEvery(Startup.Types.Startup, startup),
    takeLatest(Repo.Types.Request, requestRepo, api)
  ]
}
