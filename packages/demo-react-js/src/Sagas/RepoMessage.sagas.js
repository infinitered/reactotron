import RS from 'ramdasauce'
import { call, put } from 'redux-saga/effects'
import * as RepoMessage from '../Redux/RepoMessage.redux'

export function * request (api, action) {
  // make the call to github
  const { ok, data, status, problem } = yield call(api.get, '/repos/reactotron/reactotron/commits')
  // are we good?
  if (ok) {
    const commit = RS.dotPath('0.commit', data)
    const { message, url, author, tree } = commit
    const { name } = author
    const { sha } = tree
    // record the last commit's message
    yield put(RepoMessage.Actions.receive(message, url, name, sha))
  } else {
    yield put(RepoMessage.Actions.failure(`uh oh: ${problem} status: ${status}`))
  }
}
