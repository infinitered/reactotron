// -----------
// FIRST PARTY
// -----------

// import validate from './validate'
import getHost from './get-host'

export trackGlobalErrors from './plugins/track-global-errors'
export openInEditor from './plugins/open-in-editor'

// ------------
// SECOND PARTY
// ------------

import { createClient } from 'reactotron-core-client'

// -----------
// THIRD PARTY
// -----------

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

// send it back
export default reactotron
