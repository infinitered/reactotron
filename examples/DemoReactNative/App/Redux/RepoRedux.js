export const Types = {
  Request: 'repo.request',
  Receive: 'repo.receive',
  Failure: 'repo.failure',
};

export const Actions = {
  request: repo => ({type: Types.Request, repo}),
  receive: (message, url, name, sha, avatar) => ({
    type: Types.Receive,
    message,
    url,
    name,
    sha,
    avatar,
  }),
  failure: error => ({type: Types.Failure, error}),
};

export const INITIAL_STATE = {
  message: null,
  repo: null,
  url: null,
  name: null,
  sha: null,
  fetching: false,
  avatar: null,
  error: null,
};

// we're going out for the repo message
const request = (state, {repo}) => ({...INITIAL_STATE, fetching: true, repo});

// we've got a repo message
const receive = (state, {message, url, name, sha, avatar}) => {
  return {...state, fetching: false, message, url, name, sha, avatar};
}

// we failed to get the repo message :(
const failure = (state, action) => ({
  ...state,
  fetching: false,
  error: action.error,
});

// actions ->
const reducerMap = {
  [Types.Request]: request,
  [Types.Receive]: receive,
  [Types.Failure]: failure,
};

// our reducer
export const reducer = (state = INITIAL_STATE, action) => {
  const handler = reducerMap[action.type];
  return typeof handler === 'function' ? handler(state, action) : state;
}
