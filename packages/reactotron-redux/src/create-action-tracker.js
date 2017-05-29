import { is, concat, merge, any } from 'ramda'
import { DEFAULT_REPLACER_TYPE } from './replacement-reducer'

const DEFAULTS = {
  // except: [] // which actions
}

// create the store enhancer
export default (reactotron, trackerOptions = {}) => {
  // verify reactotron is sane
  if (!(is(Object, reactotron) && typeof reactotron.use === 'function')) {
    throw new Error('invalid reactotron passed')
  }

  // assemble a crack team of options to use
  const options = merge(DEFAULTS, trackerOptions)
  const exceptions = concat([DEFAULT_REPLACER_TYPE], options.except || [])

  // the store enhancer
  return next => (reducer, initialState, enhancer) => {
    // create the original store
    const store = next(reducer, initialState, enhancer)

    // return a new store
    return {
      // featuring the properties of the original store
      ...store,

      // and a brand new dispatch function that wraps the old dispatch
      dispatch: action => {
        // start a timer
        const elapsed = reactotron.startTimer()

        // call the original dispatch that actually does the real work
        const result = store.dispatch(action)

        // stop the timer
        const ms = elapsed()

        var unwrappedAction = action.type === 'PERFORM_ACTION' && action.action ? action.action : action

        // if matchException is true, actionType is matched with exception
        const matchException = (exception, actionType) => {
          if (typeof exception === 'string') {
            return actionType === exception
          } else if (typeof exception === 'function') {
            return exception(actionType)
          } else if (exception instanceof RegExp) {
            return exception.test(actionType)
          } else {
            return false
          }
        }

        const matchExceptions = any(exception => matchException(exception, unwrappedAction.type), exceptions)

        // action not blacklisted?
        // if matchException is true, action.type is matched with exception
        if (!matchExceptions) {
          // check if the app considers this important
          let important = false
          if (trackerOptions && typeof trackerOptions.isActionImportant === 'function') {
            important = !!trackerOptions.isActionImportant(unwrappedAction)
          }

          reactotron.reportReduxAction(unwrappedAction, ms, important)
        }

        return result
      }
    }
  }
}
