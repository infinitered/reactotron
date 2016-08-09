var createClient = require('reactotron-core-client').createClient
var io = require('socket.io-client')

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

var DEFAULTS = {
  io,
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
var reactotron = createClient(DEFAULTS)

// send it back
module.exports = reactotron
