import trackGlobalErrors from './plugins/track-global-errors'
import openInEditor from './plugins/open-in-editor'
import overlay from './plugins/overlay'
import asyncStorage from './plugins/async-storage'
import networking from './plugins/networking'
import storybook from './plugins/storybook'
import clipboard from './plugins/clipboard'
import { createClient } from 'reactotron-core-client'
import getHost from 'rn-host-detect'

export { trackGlobalErrors, openInEditor, overlay, asyncStorage, networking, storybook }
// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

const DEFAULTS = {
  createSocket: path => new WebSocket(path), // eslint-disable-line
  host: getHost('localhost'),
  port: 9090,
  name: 'React Native App',
  userAgent: 'reactotron-react-native',
  reactotronVersion: 'BETA', // TODO: figure this out for realz.  why is this hard?  it must be me.
  environment: __DEV__ ? 'development' : 'production' // naive... TODO: find the right way ya lazy bum.
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
 * @param {boolean} options.clipboard    `false` to turn off.
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

  if (options.clipboard !== false) {
    reactotron.use(clipboard())
  }

  return reactotron
}

// send it back
export default reactotron
