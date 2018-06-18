/**
 * Provides async storage information to Reactotron
 */
import { AsyncStorage } from "react-native"

// defaults
const PLUGIN_DEFAULTS = {
  ignore: [],
}

// our plugin entry point
export default options => reactotron => {
  // setup configuration
  const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})
  const ignore = config["ignore"] || PLUGIN_DEFAULTS.ignore

  let swizzSetItem = undefined
  let swizzRemoveItem = undefined
  let swizzMergeItem = undefined
  let swizzClear = undefined
  let swizzMultiSet = undefined
  let swizzMultiRemove = undefined
  let swizzMultiMerge = undefined
  let isSwizzled = false

  const sendToReactotron = (action, data) => {
    reactotron.send("asyncStorage.mutation", { action, data })
  }

  const setItem = async (key, value, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("setItem", { key, value })
      }
    } catch (e) {}
    return swizzSetItem(key, value, callback)
  }

  const removeItem = async (key, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("removeItem", { key })
      }
    } catch (e) {}
    return swizzRemoveItem(key, callback)
  }

  const mergeItem = async (key, value, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("mergeItem", { key, value })
      }
    } catch (e) {}
    return swizzMergeItem(key, value, callback)
  }

  const clear = async callback => {
    try {
      sendToReactotron("clear")
    } catch (e) {}
    return swizzClear(callback)
  }

  const multiSet = async (pairs, callback) => {
    try {
      const shippablePairs = (pairs || []).filter(
        pair => pair && pair[0] && ignore.indexOf(pair[0]) < 0
      )
      if (shippablePairs.length > 0) {
        sendToReactotron("multiSet", { pairs: shippablePairs })
      }
    } catch (e) {}
    return swizzMultiSet(pairs, callback)
  }

  const multiRemove = async (keys, callback) => {
    try {
      const shippableKeys = (keys || []).filter(key => ignore.indexOf(key) < 0)
      if (shippableKeys.length > 0) {
        sendToReactotron("multiRemove", { keys: shippableKeys })
      }
    } catch (e) {}
    return swizzMultiRemove(keys, callback)
  }

  const multiMerge = async (pairs, callback) => {
    try {
      const shippablePairs = (pairs || []).filter(
        pair => pair && pair[0] && ignore.indexOf(pair[0]) < 0
      )
      if (shippablePairs.length > 0) {
        sendToReactotron("multiMerge", { pairs: shippablePairs })
      }
    } catch (e) {}
    return swizzMultiMerge(pairs, callback)
  }

  /**
   * Hijacks the AsyncStorage API.
   */
  const trackAsyncStorage = () => {
    if (isSwizzled) return

    swizzSetItem = AsyncStorage.setItem
    AsyncStorage.setItem = setItem

    swizzRemoveItem = AsyncStorage.removeItem
    AsyncStorage.removeItem = removeItem

    swizzMergeItem = AsyncStorage.mergeItem
    AsyncStorage.mergeItem = mergeItem

    swizzClear = AsyncStorage.clear
    AsyncStorage.clear = clear

    swizzMultiSet = AsyncStorage.multiSet
    AsyncStorage.multiSet = multiSet

    swizzMultiRemove = AsyncStorage.multiRemove
    AsyncStorage.multiRemove = multiRemove

    swizzMultiMerge = AsyncStorage.multiMerge
    AsyncStorage.multiMerge = multiMerge

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

  // reactotronShipStorageValues()
  trackAsyncStorage()

  return {
    features: {
      trackAsyncStorage,
      untrackAsyncStorage,
    },
  }
}
