import RS from 'ramdasauce'
import getCleanedState from './state-cleaner'

// sends the values at the given location
export default (state, reactotron, path) => {
  const cleanedState = getCleanedState(state)

  if (RS.isNilOrEmpty(path)) {
    // send the whole damn tree
    reactotron.stateValuesResponse(null, cleanedState)
  } else {
    // send a leaf of the tree
    reactotron.stateValuesResponse(path, RS.dotPath(path, cleanedState))
  }
}
