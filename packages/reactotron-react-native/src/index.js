// -----------
// FIRST PARTY
// -----------

import validate from './validate'

// ------------
// SECOND PARTY
// ------------

import { createClient } from 'reactotron-core-client'

// -----------
// THIRD PARTY
// -----------

import R from 'ramda'

// -------------
// THE HACK ZONE
// -------------

// set a userAgent manually so socket.io works.
if (!window.navigator || !window.navigator.userAgent) {
  window.navigator.userAgent = 'reactotron-react-native'
}

// Only then do we load socket.io. This has to be done as a require to preserve
// the order of user agent being set first.  Also, it's a var so it doesn't get
// hoisted.

var io = require('socket.io-client/socket.io')

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

const DEFAULTS = {
  host: 'localhost',
  port: 9090,
  name: 'reactotron-react-native'
}

// -----------
// HERE WE GO!
// -----------

class Reactotron {

  /**
   * The configuration options for this library.
   */
  options = R.merge({}, DEFAULTS)

  /**
   * The reactotron-core-client.
   */
  client = null

  /**
   * A count of messages received this session.  Really just for debugging.
   */
  count = 0

  /**
   * Connect to the server with these options.
   */
  connect (options = {}) {
    // sanity check the options
    const newOptions = R.merge(this.options, options)
    validate(newOptions)
    this.options = newOptions

    // create the client
    this.client = createClient({
      io,
      name: this.options.name,
      host: this.options.host,
      port: this.options.port,
      onCommand: this.onCommand.bind(this),
      onConnect: this.options.onConnect,
      onDisconnect: this.options.onDisconnect
    })

    // let's connect
    this.client.connect()

    return this
  }

  /**
   * Fires when a command comes in from the server.
   */
  onCommand (command) {
    this.count++
  }

  /**
   * Send this command to the server.
   */
  send (type, payload) {
    this.client.send(type, payload)
  }

}

// the app-wide one-and-only
const reactotron = new Reactotron()

export default reactotron
