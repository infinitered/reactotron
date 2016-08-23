import R from 'ramda'
import createPlugin from './plugin'

const DEFAULTS = {
  // except: [] // which actions
}

/**
 * Create the enhancer.
 *
 * @params {Object} reactotron - The Reactotron instance to which we're attaching.
 * @params {Object} enhancerOptions - The options for the enhancer.
 */
const createReactotronStoreEnhancer = (reactotron, enhancerOptions = {}) => {
  // verify reactotron
  if (!(R.is(Object, reactotron) && typeof reactotron.use === 'function')) {
    throw new Error('invalid reactotron passed')
  }

  // assemble a crack team of options to use
  const options = R.merge(DEFAULTS, enhancerOptions)

  // an enhancer is a function that returns a store
  const reactotronEnhancer = createStore => (reducer, initialState, enhancer) => {
    // the store to create
    const store = createStore(reducer, initialState, enhancer)

    // swizzle the current dispatch
    const originalDispatch = store.dispatch

    // create our dispatch
    const dispatch = action => {
      // start a timer
      const elapsed = reactotron.startTimer()

      // call the original dispatch that actually does the real work
      const result = originalDispatch(action)

      // stop the timer
      const ms = elapsed()

      // action not blacklisted?
      if (!R.contains(action.type, options.except || [])) {
        // check if the app considers this important
        let important = false
        if (enhancerOptions && typeof enhancerOptions.isActionImportant === 'function') {
          important = !!enhancerOptions.isActionImportant(action)
        }

        plugin.report(action, ms, important)
      }

      // return the real work's result
      return result
    }
    const newStore = R.merge(store, { dispatch: dispatch.bind(store) })
    const plugin = createPlugin(newStore)
    reactotron.use(plugin)

    // send the store back, but with our our dispatch
    return newStore
  }

  return reactotronEnhancer
}

export default createReactotronStoreEnhancer
