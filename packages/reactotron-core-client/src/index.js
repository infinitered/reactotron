import R from 'ramda'
import validate from './validate'

const DEFAULTS = {
  io: null, // the socket.io function to create a socket
  host: 'localhost', // the server to connect (required)
  port: 9090, // the port to connect (required)
  name: 'reactotron-core-client', // some human-friendly session name
  onCommand: R.identity // the function called when we receive a command
}

export class Client {

  // the configuration options
  options = R.merge({}, DEFAULTS)
  connected = false
  socket = null

  /**
   * Set the configuration options.
   */
  configure (options = {}) {
    // options get merged & validated before getting set
    const newOptions = R.merge(this.options, options)
    validate(newOptions)
    this.options = newOptions

    return this
  }

  /**
   * Connect to the Reactotron server.
   */
  connect () {
    this.connected = true
    const { io, host, port, onCommand } = this.options

    // establish a socket.io connection to the server
    const socket = io(`ws://${host}:${port}`, {
      // jsonp: false,
      // transports: ['websocket', 'polling']
    })

    // fires when we talk to the server
    socket.on('connect', () => {
      socket.emit('hello.client', this.options)
    })

    // fires when we receive a command, just forward it off
    socket.on('command', command => onCommand(command))

    // assign the socket to the instance
    this.socket = socket

    return this
  }

  /**
   * Sends a command to the server
   */
  send (type, payload) {
    this.socket.emit('command', { type, payload })
  }

}

// convenience factory function
export const createClient = (options) => {
  const client = new Client()
  client.configure(options)
  return client
}
