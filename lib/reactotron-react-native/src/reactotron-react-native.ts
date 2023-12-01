import { Platform, NativeModules } from "react-native"
import { createClient } from "reactotron-core-client"
import type {
  ClientOptions,
  InferFeaturesFromPlugins,
  PluginCreator,
  Reactotron,
  ReactotronCore,
} from "reactotron-core-client"
import type { AsyncStorageStatic } from "@react-native-async-storage/async-storage"

import getReactNativeVersion from "./helpers/getReactNativeVersion"
import getReactNativeDimensions from "./helpers/getReactNativeDimensions"
import asyncStorage, { AsyncStorageOptions } from "./plugins/asyncStorage"
import overlay from "./plugins/overlay"
import openInEditor, { OpenInEditorOptions } from "./plugins/openInEditor"
import trackGlobalErrors, { TrackGlobalErrorsOptions } from "./plugins/trackGlobalErrors"
import networking, { NetworkingOptions } from "./plugins/networking"
import storybook from "./plugins/storybook"
import devTools from "./plugins/devTools"
import trackGlobalLogs from "./plugins/trackGlobalLogs"

const constants = NativeModules.PlatformConstants || {}

const REACTOTRON_ASYNC_CLIENT_ID = "@REACTOTRON/clientId"

let tempClientId: string | null = null

/**
 * Most of the time, host should be 'localhost'.
 * But sometimes, it's not.  So we need to figure out what it is.
 * @see https://github.com/infinitered/reactotron/issues/1107
 *
 * On an Android emulator, if you want to connect any servers of local, you will need run adb reverse on your terminal. This function gets the localhost IP of host machine directly to bypass this.
 */
const getHost = (defaultHost = "localhost") =>
  typeof NativeModules?.SourceCode?.getConstants().scriptURL === "string" // type guard in case this ever breaks https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/NativeModules/specs/NativeSourceCode.js#L15-L21
    ? NativeModules.SourceCode.scriptURL // Example: 'http://192.168.0.100:8081/index.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true&app=com.helloworld'
        .split("://")[1] // Remove the scheme: '192.168.0.100:8081/index.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true&app=com.helloworld'
        .split("/")[0] // Remove the path: '192.168.0.100:8081'
        .split(":")[0] // Remove the port: '192.168.0.100'
    : defaultHost

const DEFAULTS: ClientOptions<ReactotronReactNative> = {
  createSocket: (path: string) => new WebSocket(path), // eslint-disable-line
  host: getHost("localhost"),
  port: 9090,
  name: "React Native App",
  environment: process.env.NODE_ENV || (__DEV__ ? "development" : "production"),
  client: {
    reactotronLibraryName: "reactotron-react-native",
    reactotronLibraryVersion: "REACTOTRON_REACT_NATIVE_VERSION",
    platform: Platform.OS,
    platformVersion: Platform.Version,
    osRelease: constants.Release,
    model: constants.Model,
    serverHost: constants.ServerHost,
    forceTouch: constants.forceTouchAvailable || false,
    interfaceIdiom: constants.interfaceIdiom,
    systemName: constants.systemName,
    uiMode: constants.uiMode,
    serial: constants.Serial,
    androidId: constants.androidID,
    reactNativeVersion: getReactNativeVersion(),
    ...getReactNativeDimensions(),
  },
  /* eslint-disable @typescript-eslint/no-use-before-define */
  getClientId: async () => {
    if (reactotron.asyncStorageHandler) {
      return reactotron.asyncStorageHandler.getItem(REACTOTRON_ASYNC_CLIENT_ID)
    }

    return tempClientId
  },
  setClientId: async (clientId: string) => {
    if (reactotron.asyncStorageHandler) {
      return reactotron.asyncStorageHandler.setItem(REACTOTRON_ASYNC_CLIENT_ID, clientId)
    }

    tempClientId = clientId
  },
  proxyHack: true,
}

export interface UseReactNativeOptions {
  errors?: TrackGlobalErrorsOptions | boolean
  log?: boolean
  editor?: OpenInEditorOptions | boolean
  overlay?: boolean
  asyncStorage?: AsyncStorageOptions | boolean
  networking?: NetworkingOptions | boolean
  storybook?: boolean
  devTools?: boolean
}

export const reactNativeCorePlugins = [
  asyncStorage(),
  trackGlobalErrors(),
  trackGlobalLogs(),
  openInEditor(),
  overlay(),
  networking(),
  storybook(),
  devTools(),
] satisfies PluginCreator<ReactotronCore>[]

type ReactNativePluginFeatures = InferFeaturesFromPlugins<
  ReactotronCore,
  typeof reactNativeCorePlugins
>

export interface ReactotronReactNative extends Reactotron, ReactNativePluginFeatures {
  useReactNative: (options?: UseReactNativeOptions) => this
  asyncStorageHandler?: AsyncStorageStatic
  setAsyncStorageHandler: (asyncStorage: AsyncStorageStatic) => this
}

const reactotron = createClient<ReactotronReactNative>(DEFAULTS)

function getPluginOptions<T>(options?: T | boolean): T {
  return typeof options === "object" ? options : null
}

reactotron.useReactNative = (options: UseReactNativeOptions = {}) => {
  if (options.errors !== false) {
    reactotron.use(trackGlobalErrors(getPluginOptions(options.errors)))
  }

  if (options.log !== false) {
    reactotron.use(trackGlobalLogs())
  }

  if (options.editor !== false) {
    reactotron.use(openInEditor(getPluginOptions(options.editor)))
  }

  if (options.overlay !== false) {
    reactotron.use(overlay())
  }

  if (options.asyncStorage !== false) {
    reactotron.use(asyncStorage(getPluginOptions(options.asyncStorage)))
  }

  if (options.networking !== false) {
    reactotron.use(networking(getPluginOptions(options.networking)))
  }

  if (options.storybook !== false) {
    reactotron.use(storybook())
  }

  if (options.devTools !== false) {
    reactotron.use(devTools())
  }

  return reactotron
}

reactotron.setAsyncStorageHandler = (asyncStorage: AsyncStorageStatic) => {
  reactotron.asyncStorageHandler = asyncStorage

  return reactotron
}

export {
  asyncStorage,
  trackGlobalErrors,
  trackGlobalLogs,
  openInEditor,
  overlay,
  networking,
  storybook,
  devTools,
}

export type { ClientOptions }

export default reactotron
