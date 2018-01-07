import { createClient } from 'reactotron-core-client'
export trackGlobalErrors from './plugins/track-global-errors'

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

var DEFAULTS = {
  createSocket: path => new WebSocket(path), // eslint-disable-line
  host: 'localhost',
  port: 9090,
  name: 'React JS App',
  userAgent: window.navigator.userAgent,
  reactotronVersion: 'BETA' // TODO: figure this out for realz.  why is this hard?  it must be me.
}

// -----------
// HERE WE GO!
// -----------
// Create the default reactotron.
export default createClient(DEFAULTS)
