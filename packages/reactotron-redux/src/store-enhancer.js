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
    const plugin = createPlugin(store)
    reactotron.use(plugin)

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
        plugin.report(action, ms)
      }

      // return the real work's result
      return result
    }

    // send the store back, but with our our dispatch
    return R.merge(store, { dispatch })
  }

  return reactotronEnhancer
}

export default createReactotronStoreEnhancer
