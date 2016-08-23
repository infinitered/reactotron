import R from 'ramda'

// subscribe to a new set of paths
export default (subscriptions, state, reactotron, paths = []) =>
  R.pipe(R.flatten, R.uniq)(paths)
