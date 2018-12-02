import R from 'ramda'
import RS from 'ramdasauce'
import getCleanedState from './state-cleaner'

// sends the key names at the given location
export default (state, reactotron, path) => {
  const cleanedState = getCleanedState(state)

  if (RS.isNilOrEmpty(path)) {
    reactotron.stateKeysResponse(null, R.keys(cleanedState))
  } else {
    const keys = R.keys(RS.dotPath(path, cleanedState))
    reactotron.stateKeysResponse(path, keys)
  }
}
