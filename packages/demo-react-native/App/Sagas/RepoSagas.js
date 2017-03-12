import RS from 'ramdasauce'
import { delay } from 'redux-saga'
import { race, call, put } from 'redux-saga/effects'
import * as Repo from '../Redux/RepoRedux'

function * sampleNestedGenerator () {
  yield call(delay, 49)
  yield call(delay, 51)
}

function * muchSlowerGenerator () {
  yield call(delay, 1000)
}

export function * request (api, action) {
  try {
    // make the call to github
    const { repo } = action
    const { ok, data, status, problem } = yield call(api.get, `/repos/${repo}/commits`)
    yield call(sampleNestedGenerator)

    yield race([
      call(sampleNestedGenerator),
      call(muchSlowerGenerator)
    ])

    // are we good?
    if (ok) {
      const entry = RS.dotPath('0', data)
      const { commit, author, html_url: url } = entry
      const { message, tree } = commit
      const { login, avatar_url: avatar } = author
      const { sha } = tree
      // record the last commit's message
      yield put(Repo.Actions.receive(message, url, login, sha, avatar))
      if (avatar) {
        yield call(api.get, avatar, null, { headers: { 'Accept': '*' } })
      }
    } else {
      yield put(Repo.Actions.failure(`uh oh: ${problem} status: ${status}`))
    }
  } catch (e) {
    console.log(e.message)
    console.log(e)
  }
}
