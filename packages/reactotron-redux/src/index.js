// This is some goofy stuff to accomodate backwards compat.
import enhancer from './store-enhancer'

// Creates a replacement reducer so we can listen for Reactotron messages
// to clobber the state from the outside.
enhancer.createReplacementReducer =
  (rootReducer, actionName = 'REACTOTRON_RESTORE_STATE') => (state, action) => {
    const whichState = action.type === actionName ? action.state : state
    return rootReducer(whichState, action)
  }

// a named version of the store enhancer
enhancer.createReactotronStoreEnhancer = enhancer

export default enhancer
