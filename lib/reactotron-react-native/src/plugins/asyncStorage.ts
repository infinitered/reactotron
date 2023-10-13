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

  /**
   * Hijacks the AsyncStorage API.
   */
  const trackAsyncStorage = () => {
    if (isSwizzled) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzSetItem = reactotron.asyncStorageHandler.setItem
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.setItem = setItem

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzRemoveItem = reactotron.asyncStorageHandler.removeItem

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.removeItem = removeItem

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzMergeItem = reactotron.asyncStorageHandler.mergeItem
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.mergeItem = mergeItem

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzClear = reactotron.asyncStorageHandler.clear
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.clear = clear

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzMultiSet = reactotron.asyncStorageHandler.multiSet
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.multiSet = multiSet

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzMultiRemove = reactotron.asyncStorageHandler.multiRemove
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.multiRemove = multiRemove

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    swizzMultiMerge = reactotron.asyncStorageHandler.multiMerge
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.multiMerge = multiMerge

    isSwizzled = true
  }

  const untrackAsyncStorage = () => {
    if (!isSwizzled) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.setItem = swizzSetItem
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.removeItem = swizzRemoveItem
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.mergeItem = swizzMergeItem
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.clear = swizzClear
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.multiSet = swizzMultiSet
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.multiRemove = swizzMultiRemove
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: reactotron-apis
    reactotron.asyncStorageHandler.multiMerge = swizzMultiMerge

    isSwizzled = false
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: reactotron-apis
  if (reactotron.asyncStorageHandler) {
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
