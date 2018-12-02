import { createStore, compose } from 'redux'

export default (reactotron, rootReducer, preloadedState, enhancer) => {
  // shuffle around params if preloadedState is null
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  // wrap the reducer with one which we can replace
  const reducer = reactotron.createReplacementReducer(rootReducer)

  // wrap the enhancer with our beginning and ending one
  const wrappedEnhancer = enhancer
    ? compose(enhancer, reactotron.createActionTracker())
    : reactotron.createActionTracker()

  // call the redux create store
  const store = createStore(reducer, preloadedState, wrappedEnhancer)

  // remember this store
  reactotron.setReduxStore(store)

  return store
}
