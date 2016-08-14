import RS from 'ramdasauce'
import { call, put } from 'redux-saga/effects'
import * as Repo from '../Redux/Repo.redux'

export function * request (api, action) {
  // make the call to github
  const { repo } = action
  const { ok, data, status, problem } = yield call(api.get, `/repos/${repo}/commits`)
  // are we good?
  if (ok) {
    const entry = RS.dotPath('0', data)
    const { commit, author, html_url: url } = entry
    const { message, tree } = commit
    const { name, avatar_url } = author
    const { sha } = tree
    console.log({ avatar_url })
    // record the last commit's message
    yield put(Repo.Actions.receive(message, url, name, sha, avatar_url))
  } else {
    yield put(Repo.Actions.failure(`uh oh: ${problem} status: ${status}`))
  }
}
