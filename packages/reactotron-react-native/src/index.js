// -----------
// FIRST PARTY
// -----------

import trackGlobalErrors from './plugins/track-global-errors'
import openInEditor from './plugins/open-in-editor'
import overlay from './plugins/overlay'
import asyncStorage from './plugins/async-storage'
import networking from './plugins/networking'

export { trackGlobalErrors, openInEditor, overlay, asyncStorage, networking }

// ------------
// SECOND PARTY
// ------------

import { createClient } from 'reactotron-core-client'

// -----------
// THIRD PARTY
// -----------

import getHost from 'rn-host-detect'
var io = require('socket.io-client/dist/socket.io')

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

const DEFAULTS = {
  io,
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

// -------------
// PLUGIN HELPER
// -------------
reactotron.useReactNative = (options = {}) => {
  return reactotron
    .use(trackGlobalErrors(options.trackGlobalErrors || {}))
    .use(openInEditor(options.openInEditor || {}))
    .use(overlay())
    .use(asyncStorage(options.asyncStorage || {}))
    .use(networking(options.networking || {}))
}

// send it back
export default reactotron
