import { take, call, put } from 'redux-saga/effects'
import RS from 'ramdasauce'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'

export function * getGithub (api) {
  // make the call to github
  const response = yield call(api.get, '/repos/skellock/reactotron/commits')

  // are we good?
  if (response.ok) {
    const message = RS.dotPath('data.0.commit.message', response)
    // record the last commit's message
    yield put(Actions.receiveGithub(message))
  } else {
    yield put(Actions.receiveGithubFailure())
  }
}

export default (api) => {
  function * watchGithubRequest () {
    while (true) {
      yield take(Types.GITHUB_REQUEST)
      yield call(getGithub, api)
    }
  }

  return {
    watchGithubRequest
  }
}
