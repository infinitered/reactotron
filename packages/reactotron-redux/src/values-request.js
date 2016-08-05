import RS from 'ramdasauce'

// sends the values at the given location
export default (state, reactotron, path) => {
  if (RS.isNilOrEmpty(path)) {
    // send the whole damn tree
    reactotron.stateValuesResponse(null, state)
  } else {
    // send a leaf of the tree
    reactotron.stateValuesResponse(path, RS.dotPath(path, state))
  }
}
