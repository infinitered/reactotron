import { takeEvery, takeLatest } from 'redux-saga'
import ApiSauce from 'apisauce'
import Reactotron from 'reactotron-react-js'

import * as Startup from '../Redux/Startup.redux'
import * as Repo from '../Redux/Repo.redux'

import { startup } from './Startup.sagas'
import { request as requestRepo } from './Repo.sagas'

const api = ApiSauce.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
})

api.addMonitor(Reactotron.apisauce)

export default function * rootSaga () {
  yield [
    takeLatest(Repo.Types.Request, requestRepo, api),
    takeEvery(Startup.Types.Startup, startup)
  ]
}
