import createAction from './CreateAction'
import Types from './Types'

const startup = () => createAction(Types.STARTUP)
const requestGithub = (city) => createAction(Types.GITHUB_REQUEST, { city })
const receiveGithub = (message) => createAction(Types.GITHUB_RECEIVE, { message })
const receiveGithubFailure = () => createAction(Types.GITHUB_FAILURE)

/**
 Makes available all the action creators we've created.
 */
export default {
  startup,
  requestGithub,
  receiveGithub,
  receiveGithubFailure
}
