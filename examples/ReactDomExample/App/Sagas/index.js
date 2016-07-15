import { fork } from 'redux-saga/effects'
import ApiSauce from 'apisauce'
import { watchStartup } from './StartupSaga'
import GithubSaga from './GithubSaga'
import Reactotron from '../../client'

const api = ApiSauce.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
})

api.addMonitor((response) => {
  Reactotron.apiLog(response)
})

const {watchGithubRequest} = GithubSaga(api)

function * rootSaga () {
  yield fork(watchStartup)
  yield fork(watchGithubRequest)
}

export default rootSaga
