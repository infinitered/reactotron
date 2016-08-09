export const Types = {
  Request: 'RepoMessage.Request',
  Receive: 'RepoMessage.Receive',
  Failure: 'RepoMessage.Failure'
}

export const Actions = {
  request: () => ({ type: Types.Request }),
  receive: (message, url, name, sha) => ({ type: Types.Receive, message, url, name, sha }),
  failure: (error) => ({ type: Types.Failure, error })
}

export const INITIAL_STATE = {
  message: null,
  url: null,
  name: null,
  sha: null,
  fetching: false,
  error: null
}

// we're going out for the repo message
const request = (state, action) =>
  ({ ...INITIAL_STATE, fetching: true })

// we've got a repo message
const receive = (state, action) => {
  const { message, url, name, sha } = action
  return { ...state, fetching: false, message, url, name, sha }
}

// we failed to get the repo message :(
const failure = (state, action) =>
  ({ ...state, fetching: false, error: action.error })

// actions ->
const reducerMap = {
  [Types.Request]: request,
  [Types.Receive]: receive,
  [Types.Failure]: failure
}

// our reducer
export const reducer = (state = INITIAL_STATE, action) => {
  const handler = reducerMap[action.type]
  return typeof handler === 'function' ? handler(state, action) : state
}
