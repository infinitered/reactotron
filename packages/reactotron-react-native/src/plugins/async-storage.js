/**
 * Provides async storage information to Reactotron
 */
import { merge, reject, contains } from 'ramda'
import { AsyncStorage } from 'react-native'

// defaults
const PLUGIN_DEFAULTS = {
  ignore: []
}

// our plugin entry point
export default options => reactotron => {
  // setup configuration
  const config = merge(PLUGIN_DEFAULTS, options || {})
  const ignore = config['ignore'] || []

  let swizzSetItem = null
  let swizzRemoveItem = null
  let swizzMergeItem = null
  let swizzClear = null
  let swizzMultiSet = null
  let swizzMultiRemove = null
  let swizzMultiMerge = null
  let isSwizzled = false

  /**
   * Sends the contents of AsyncStorage to Reactotron.
   */
  const reactotronShipStorageValues = () => {
    AsyncStorage.getAllKeys(
      (_, keys) => AsyncStorage.multiGet(keys, (_, values = []) => {
        const valuesToSend = reject(
          item => contains(item[0], ignore),
          values
        )
        // NOTE(steve): for now let's ship everything... until we get a UI in place
        // to make request/response calls
        reactotron.send('asyncStorage.values.change', valuesToSend)
      })
    )
  }

  /**
   * Swizzles one of the AsyncStorage public api functions.
   *
   * @param {function} originalMethod - The original function to override.
   */
  const reactotronStorageHijacker = originalMethod => (...args) => {
    // Depending on the call we could have the callback in one of any of the three args, walk backwards till we find the callback
    let oldCallback = args.length > 0 ? args[args.length - 1] : null

    if (typeof oldCallback !== 'function') {
      oldCallback = () => {}
      args.push(oldCallback)
    }

    const newArgs = [
      ...args.slice(0, args.length - 1),
      (...cbArgs) => {
        reactotronShipStorageValues()
        oldCallback(...cbArgs)
      }
    ]

    originalMethod(...newArgs)
  }

  const trackAsyncStorage = () => {
    if (isSwizzled) return

    swizzSetItem = AsyncStorage.setItem
    AsyncStorage.setItem = reactotronStorageHijacker(swizzSetItem)

    swizzRemoveItem = AsyncStorage.removeItem
    AsyncStorage.removeItem = reactotronStorageHijacker(swizzRemoveItem)

    swizzMergeItem = AsyncStorage.mergeItem
    AsyncStorage.mergeItem = reactotronStorageHijacker(swizzMergeItem)

    swizzClear = AsyncStorage.clear
    AsyncStorage.clear = reactotronStorageHijacker(swizzClear)

    swizzMultiSet = AsyncStorage.multiSet
    AsyncStorage.multiSet = reactotronStorageHijacker(swizzMultiSet)

    swizzMultiRemove = AsyncStorage.multiRemove
    AsyncStorage.multiRemove = reactotronStorageHijacker(swizzMultiRemove)

    swizzMultiMerge = AsyncStorage.multiMerge
    AsyncStorage.multiMerge = reactotronStorageHijacker(swizzMultiMerge)

    isSwizzled = true
  }

  const untrackAsyncStorage = () => {
    if (!isSwizzled) return

    AsyncStorage.setItem = swizzSetItem
    AsyncStorage.removeItem = swizzRemoveItem
    AsyncStorage.mergeItem = swizzMergeItem
    AsyncStorage.clear = swizzClear
    AsyncStorage.multiSet = swizzMultiSet
    AsyncStorage.multiRemove = swizzMultiRemove
    AsyncStorage.multiMerge = swizzMultiMerge

    isSwizzled = false
  }

  reactotronShipStorageValues()
  trackAsyncStorage()

  return {
    features: {
      trackAsyncStorage,
      untrackAsyncStorage
    }
  }
}
