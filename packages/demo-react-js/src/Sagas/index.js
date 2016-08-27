import { takeEvery, takeLatest } from 'redux-saga'
import ApiSauce from 'apisauce'
const Reactotron = process.env.NODE_ENV !== 'production' && require('reactotron-react-js').default

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

if (process.env.NODE_ENV !== 'production') {
  api.addMonitor(Reactotron.apisauce)
}

export default function * rootSaga () {
  yield [
    takeLatest(Repo.Types.Request, requestRepo, api),
    takeEvery(Startup.Types.Startup, startup)
  ]
}
