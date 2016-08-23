import RS from 'ramdasauce'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as Repo from '../Redux/RepoRedux'

export function * request (api, action) {
  try {
    // make the call to github
    const { repo } = action
    const { ok, data, status, problem } = yield call(api.get, `/repos/${repo}/commits`)
    yield call(delay, 200)
    // are we good?
    if (ok) {
      const entry = RS.dotPath('0', data)
      const { commit, author, html_url: url } = entry
      const { message, tree } = commit
      const { login, avatar_url } = author
      const { sha } = tree
      // record the last commit's message
      yield put(Repo.Actions.receive(message, url, login, sha, avatar_url))
    } else {
      yield put(Repo.Actions.failure(`uh oh: ${problem} status: ${status}`))
    }
  } catch (e) {
    console.log(e.message)
    console.log(e)
  }
}
