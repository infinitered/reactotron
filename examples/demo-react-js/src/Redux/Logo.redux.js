export const Types = {
  Speed: 'logo.speed',
  Size: 'logo.size',
  Reset: 'logo.reset'
}

export const Actions = {
  changeSpeed: speed => ({ type: Types.Speed, speed }),
  changeSize: size => ({ type: Types.Size, size }),
  reset: () => ({ type: Types.Reset })
}

export const INITIAL_STATE = {
  size: 100,
  speed: 5
}

const changeSpeed = (state, { speed }) => ({ ...state, speed })
const changeSize = (state, { size }) => ({ ...state, size })
const reset = (state, { size }) => INITIAL_STATE

// actions ->
const reducerMap = {
  [Types.Speed]: changeSpeed,
  [Types.Size]: changeSize,
  [Types.Reset]: reset
}

// our reducer
export const reducer = (state = INITIAL_STATE, action) => {
  const handler = reducerMap[action.type]
  return typeof handler === 'function' ? handler(state, action) : state
}
