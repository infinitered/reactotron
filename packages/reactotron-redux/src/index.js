import reactotronRedux from './reactotron-redux'

/* ----------------------------------
   Begin backwards compatibility zone
   ----------------------------------
 */
import createReplacementReducer from './replacement-reducer'

// This is some goofy stuff to accomodate backwards compat.
import enhancer from './store-enhancer'

// a named version of the store enhancer (for backwards compat)
enhancer.createReactotronStoreEnhancer = enhancer

// Creates a replacement reducer so we can listen for Reactotron messages
// to clobber the state from the outside.
enhancer.createReplacementReducer = createReplacementReducer

export default enhancer

/* --------------------------------
   End backwards compatibility zone
   --------------------------------
 */

// This is the new plugin support.  Once we get out of the 1.x codebase range,
// we'll upgrade this guy as the default.
enhancer.reactotronRedux = reactotronRedux
