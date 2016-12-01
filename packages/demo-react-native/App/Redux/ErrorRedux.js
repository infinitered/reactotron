export const Types = {
  Saga: 'error.saga',
  Put: 'error.put',
  PutThrow: 'error.put.throw'
}

export const Actions = {
  throwSagaError: () => ({ type: Types.Saga }),
  throwPutError: () => ({ type: Types.Put })
}

export const INITIAL_STATE = { }

const throwAnError = (state) =>
  ({ ...state, error: speed.test }) // eslint-disable-line 

// actions ->
const reducerMap = {
  [Types.PutThrow]: throwAnError
}

// our reducer
export const reducer = (state = INITIAL_STATE, action) => {
  const handler = reducerMap[action.type]
  return typeof handler === 'function' ? handler(state, action) : state
}
