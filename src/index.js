import trackGlobalErrors from './plugins/track-global-errors'
import openInEditor from './plugins/open-in-editor'
import overlay from './plugins/overlay'
import asyncStorage from './plugins/async-storage'
import networking from './plugins/networking'
import storybook from './plugins/storybook'
import { createClient } from 'reactotron-core-client'
import getHost from './thirdparty/rn-host-detect'
import { Platform, AsyncStorage, NativeModules } from 'react-native'
import getReactNativeVersion from './get-react-native-version'
import getReactNativeDimensions from './get-react-native-dimensions'

const constants = NativeModules.PlatformConstants || {}

export { trackGlobalErrors, openInEditor, overlay, asyncStorage, networking, storybook }

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

const REACTOTRON_ASYNC_CLIENT_ID = '@REACTOTRON/clientId'

const DEFAULTS = {
  createSocket: path => new WebSocket(path), // eslint-disable-line
  host: getHost('localhost'),
  port: 9090,
  name: 'React Native App',
  environment: process.env.NODE_ENV || (__DEV__ ? 'development' : 'production'),
  client: {
    reactotronLibraryName: 'reactotron-react-native',
    reactotronLibraryVersion: 'REACTOTRON_REACT_NATIVE_VERSION',
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
    ...getReactNativeDimensions()
  },
  getClientId: async () => {
    return AsyncStorage.getItem(REACTOTRON_ASYNC_CLIENT_ID)
  },
  setClientId: clientId => {
    return AsyncStorage.setItem(REACTOTRON_ASYNC_CLIENT_ID, clientId)
  },
  proxyHack: true,
}

// -----------
// HERE WE GO!
// -----------
// Create the default reactotron.
const reactotron = createClient(DEFAULTS)

/**
 * A preset way to add all react native features.
 *
 * @param {*}       options              Configuration settings for each other plugins.
 * @param {*}       options.errors       Options for trackGlobalErrors. `false to turn off`.
 * @param {*}       options.editor       Options for the editor. `false to turn off`.
 * @param {boolean} options.overlay      `false` to turn off.
 * @param {*}       options.asyncStorage Options for the async storage tracking. `false to turn off`.
 * @param {*}       options.networking   Options for network activity. `false to turn off`.
 */
reactotron.useReactNative = (options = {}) => {
  if (options.errors !== false) {
    reactotron.use(trackGlobalErrors(options.errors))
  }

  if (options.editor !== false) {
    reactotron.use(openInEditor(options.editor))
  }

  if (options.overlay !== false) {
    reactotron.use(overlay())
  }

  if (options.asyncStorage !== false) {
    reactotron.use(asyncStorage(options.asyncStorage))
  }

  if (options.networking !== false) {
    reactotron.use(networking(options.networking))
  }

  if (options.storybook !== false) {
    reactotron.use(storybook())
  }

  return reactotron
}

// send it back
export default reactotron
