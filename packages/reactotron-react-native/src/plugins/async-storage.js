/**
 * Provides async storage information to Reactotron
 */
import { merge, map, reject } from 'ramda'
import { AsyncStorage } from 'react-native'

// defaults
const PLUGIN_DEFAULTS = {

}

// our plugin entry point
export default options => reactotron => {
  // setup configuration
  const config = merge(PLUGIN_DEFAULTS, options || {})

  let swizzSetItem = null
  let swizzRemoveItem = null
  let swizzMergeItem = null
  let swizzClear = null
  let swizzMultiSet = null
  let swizzMultiRemove = null
  let swizzMultiMerge = null
  let isSwizzled = false

  const reactotronShipStorageValues = () => {
    AsyncStorage.getAllKeys((err, keys) => AsyncStorage.multiGet(keys, (err, values) => {
      // Send an array of arrays
      //reactotron.send('storage.updated', values)
      reactotron.display({ name: 'AsyncStorage', value: { value: values }, preview: 'All the values' })
    }))
  }

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

    isSwizzled = false;
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
