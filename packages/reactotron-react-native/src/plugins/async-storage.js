/**
 * Provides async storage information to Reactotron
 */
import { AsyncStorage } from 'react-native'

// defaults
const PLUGIN_DEFAULTS = {
  ignore: []
}

// our plugin entry point
export default options => reactotron => {
  // setup configuration
  const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})
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
  const reactotronShipStorageValues = (methodName, args) => {
    AsyncStorage.getAllKeys((_, keys) =>
      AsyncStorage.multiGet(keys, (_, values = []) => {
        const valuesToSend = values.filter(item => ignore.some(ig => ig === item[0]))
        // NOTE(steve): for now let's ship everything... until we get a UI in place
        // to make request/response calls
        let previewArgs = ''
        if (args && args.length > 1) {
          previewArgs = Array.isArray(args[0]) ? `Array: ${args[0].length}` : args[0]
        }
        const preview = methodName ? `${methodName}(${previewArgs})` : ''
        reactotron.send('asyncStorage.values.change', { preview, value: valuesToSend })
      })
    )
  }

  /**
   * Swizzles one of the AsyncStorage public api functions.
   *
   * @param {function} originalMethod - The original function to override.
   * @param {string} methodName - The original method name we are overriding.
   */
  const reactotronStorageHijacker = (originalMethod, methodName) => (...args) => {
    // Depending on the call we could have the callback in one of any of the three args, walk backwards till we find the callback
    let oldCallback = args.length > 0 ? args[args.length - 1] : null

    if (typeof oldCallback !== 'function') {
      oldCallback = () => {}
      args.push(oldCallback)
    }

    const newArgs = [
      ...args.slice(0, args.length - 1),
      (...cbArgs) => {
        reactotronShipStorageValues(methodName, args)
        oldCallback(...cbArgs)
      }
    ]

    return originalMethod(...newArgs)
  }

  const trackAsyncStorage = () => {
    if (isSwizzled) return

    swizzSetItem = AsyncStorage.setItem
    AsyncStorage.setItem = reactotronStorageHijacker(swizzSetItem, 'setItem')

    swizzRemoveItem = AsyncStorage.removeItem
    AsyncStorage.removeItem = reactotronStorageHijacker(swizzRemoveItem, 'removeItem')

    swizzMergeItem = AsyncStorage.mergeItem
    AsyncStorage.mergeItem = reactotronStorageHijacker(swizzMergeItem, 'mergeItem')

    swizzClear = AsyncStorage.clear
    AsyncStorage.clear = reactotronStorageHijacker(swizzClear, 'clear')

    swizzMultiSet = AsyncStorage.multiSet
    AsyncStorage.multiSet = reactotronStorageHijacker(swizzMultiSet, 'multiSet')

    swizzMultiRemove = AsyncStorage.multiRemove
    AsyncStorage.multiRemove = reactotronStorageHijacker(swizzMultiRemove, 'multiRemove')

    swizzMultiMerge = AsyncStorage.multiMerge
    AsyncStorage.multiMerge = reactotronStorageHijacker(swizzMultiMerge, 'multiMerge')

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
