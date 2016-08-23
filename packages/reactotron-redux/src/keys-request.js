import R from 'ramda'
import RS from 'ramdasauce'

// sends the key names at the given location
export default (state, reactotron, path) => {
  if (RS.isNilOrEmpty(path)) {
    reactotron.stateKeysResponse(null, R.keys(state))
  } else {
    const keys = R.keys(RS.dotPath(path, state))
    reactotron.stateKeysResponse(path, keys)
  }
}
