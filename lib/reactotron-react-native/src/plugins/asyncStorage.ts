import type { ReactotronCore, Plugin } from "reactotron-core-client"
import type { AsyncStorageStatic } from "@react-native-async-storage/async-storage"
export interface AsyncStorageOptions {
  ignore?: string[]
}

const PLUGIN_DEFAULTS: AsyncStorageOptions = {
  ignore: [],
}

const asyncStorage = (options?: AsyncStorageOptions) => (reactotron: ReactotronCore) => {
  // setup configuration
  const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})
  const ignore = config.ignore || PLUGIN_DEFAULTS.ignore

  let swizzSetItem: AsyncStorageStatic["setItem"]
  let swizzRemoveItem: AsyncStorageStatic["removeItem"]
  let swizzMergeItem: AsyncStorageStatic["mergeItem"]
  let swizzClear: AsyncStorageStatic["clear"]
  let swizzMultiSet: AsyncStorageStatic["multiSet"]
  let swizzMultiRemove: AsyncStorageStatic["multiRemove"]
  let swizzMultiMerge: AsyncStorageStatic["multiMerge"]
  let isSwizzled = false

  const sendToReactotron = (action: string, data?: any) => {
    reactotron.send("asyncStorage.mutation", { action, data })
  }

  const setItem: AsyncStorageStatic["setItem"] = async (key, value, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("setItem", { key, value })
      }
    } catch (e) {}
    return swizzSetItem(key, value, callback)
  }

  const removeItem: AsyncStorageStatic["removeItem"] = async (key, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("removeItem", { key })
      }
    } catch (e) {}
    return swizzRemoveItem(key, callback)
  }

  const mergeItem: AsyncStorageStatic["mergeItem"] = async (key, value, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("mergeItem", { key, value })
      }
    } catch (e) {}
    return swizzMergeItem(key, value, callback)
  }

  const clear: AsyncStorageStatic["clear"] = async (callback) => {
    try {
      sendToReactotron("clear")
    } catch (e) {}
    return swizzClear(callback)
  }

  const multiSet: AsyncStorageStatic["multiSet"] = async (pairs, callback) => {
    try {
      const shippablePairs = (pairs || []).filter(
        (pair) => pair && pair[0] && ignore.indexOf(pair[0]) < 0
      )
      if (shippablePairs.length > 0) {
        sendToReactotron("multiSet", { pairs: shippablePairs })
      }
    } catch (e) {}
    return swizzMultiSet(pairs, callback)
  }

  const multiRemove: AsyncStorageStatic["multiRemove"] = async (keys, callback) => {
    try {
      const shippableKeys = (keys || []).filter((key) => ignore.indexOf(key) < 0)
      if (shippableKeys.length > 0) {
        sendToReactotron("multiRemove", { keys: shippableKeys })
      }
    } catch (e) {}
    return swizzMultiRemove(keys, callback)
  }

  const multiMerge: AsyncStorageStatic["multiMerge"] = async (pairs, callback) => {
    try {
      const shippablePairs = (pairs || []).filter(
        (pair) => pair && pair[0] && ignore.indexOf(pair[0]) < 0
      )
      if (shippablePairs.length > 0) {
        sendToReactotron("multiMerge", { pairs: shippablePairs })
      }
    } catch (e) {}
    return swizzMultiMerge(pairs, callback)
  }

  interface ReactotronPrivate extends ReactotronCore {
    asyncStorageHandler: AsyncStorageStatic
  }

  /**
   * Hijacks the AsyncStorage API.
   */
  const trackAsyncStorage = () => {
    if (isSwizzled) return

    swizzSetItem = (reactotron as ReactotronPrivate).asyncStorageHandler.setItem
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.setItem = setItem

    swizzRemoveItem = (reactotron as ReactotronPrivate).asyncStorageHandler.removeItem
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.removeItem = removeItem

    swizzMergeItem = (reactotron as ReactotronPrivate).asyncStorageHandler.mergeItem
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.mergeItem = mergeItem

    swizzClear = (reactotron as ReactotronPrivate).asyncStorageHandler.clear
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.clear = clear

    swizzMultiSet = (reactotron as ReactotronPrivate).asyncStorageHandler.multiSet
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.multiSet = multiSet

    swizzMultiRemove = (reactotron as ReactotronPrivate).asyncStorageHandler.multiRemove
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.multiRemove = multiRemove

    swizzMultiMerge = (reactotron as ReactotronPrivate).asyncStorageHandler.multiMerge
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.multiMerge = multiMerge

    isSwizzled = true
  }

  const untrackAsyncStorage = () => {
    if (!isSwizzled) return
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.setItem = swizzSetItem
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.removeItem = swizzRemoveItem
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.mergeItem = swizzMergeItem
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.clear = swizzClear
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.multiSet = swizzMultiSet
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.multiRemove = swizzMultiRemove
    ;(reactotron as ReactotronPrivate).asyncStorageHandler.multiMerge = swizzMultiMerge

    isSwizzled = false
  }

  if ((reactotron as ReactotronPrivate).asyncStorageHandler) {
    trackAsyncStorage()
  }

  return {
    features: {
      trackAsyncStorage,
      untrackAsyncStorage,
    },
  } satisfies Plugin<ReactotronCore>
}

export default asyncStorage
