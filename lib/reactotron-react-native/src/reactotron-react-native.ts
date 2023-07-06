import { Platform, NativeModules } from "react-native"
import { createClient } from "reactotron-core-client"
import type { ClientOptions, Reactotron } from "reactotron-core-client"
import getHost from "rn-host-detect"

import getReactNativeVersion from "./helpers/getReactNativeVersion"
import getReactNativeDimensions from "./helpers/getReactNativeDimensions"
import asyncStorage, { AsyncStorageHandler, AsyncStorageOptions } from "./plugins/asyncStorage"
import overlay from "./plugins/overlay"
import type { OverlayFeatures } from "./plugins/overlay"
import openInEditor, { OpenInEditorOptions } from "./plugins/openInEditor"
import trackGlobalErrors, { TrackGlobalErrorsOptions } from "./plugins/trackGlobalErrors"
import networking, { NetworkingOptions } from "./plugins/networking"
import storybook from "./plugins/storybook"
import devTools from "./plugins/devTools"

const constants = NativeModules.PlatformConstants || {}

const REACTOTRON_ASYNC_CLIENT_ID = "@REACTOTRON/clientId"

let tempClientId: string | null = null

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
  editor?: OpenInEditorOptions | boolean
  overlay?: boolean
  asyncStorage?: AsyncStorageOptions | boolean
  networking?: NetworkingOptions | boolean
  storybook?: boolean
  devTools?: boolean
}

export interface ReactotronReactNative extends Reactotron {
  useReactNative: (options?: UseReactNativeOptions) => this
  overlay: OverlayFeatures["overlay"]
  storybookSwitcher: (App: React.ReactNode) => (Root: React.ReactNode) => React.ReactNode
  asyncStorageHandler?: AsyncStorageHandler
  setAsyncStorageHandler?: (asyncStorage: any) => this
}

const reactotron = createClient<ReactotronReactNative>(DEFAULTS)

function getPluginOptions<T>(options?: T | boolean): T {
  return typeof options === "object" ? options : null
}

reactotron.useReactNative = (options: UseReactNativeOptions = {}) => {
  if (options.errors !== false) {
    reactotron.use(trackGlobalErrors(getPluginOptions(options.errors)))
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

reactotron.setAsyncStorageHandler = (asyncStorage) => {
  reactotron.asyncStorageHandler = asyncStorage

  return reactotron
}

export { asyncStorage, trackGlobalErrors, openInEditor, overlay, networking, storybook, devTools }

export type { ClientOptions }

export default reactotron
