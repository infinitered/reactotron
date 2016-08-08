import R from 'ramda'
import socketIO from 'socket.io'
import Commands from './commands'
import validate from './validation'
import { observable } from 'mobx'

const DEFAULTS = {
  port: 9090, // the port to live (required)
  onCommand: command => null, // handles inbound commands
  onStart: () => null, // handles inbound commands
  onStop: () => null, // handles inbound commands
  onConnect: socket => null, // notify connections
  onDisconnect: socket => null // notify disconnections
}

class Server {

  // the configuration options
  @observable options = R.merge({}, DEFAULTS)
  started = false
  io = null
  messageId = 0
  subscriptions = []

  /**
   * Holds the commands the client has sent.
   */
  commands = new Commands()

  /**
   * Holds the currently connected clients.
   */
  @observable connections = []

  constructor () {
    this.send = this.send.bind(this)
  }

  findBySocket = socket => R.find(R.propEq('socket', socket), this.connections)

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
   * Configures the socket.io server with our behaviours.
   */
  registerCallbacks () {
    const { onCommand, onConnect, onDisconnect } = this.options

    // when we get new clients
    this.io.on('connection', socket => {
      // details about who has connected
      const connection = {
        socket,
        id: socket.id,
        address: socket.request.connection.remoteAddress
      }

      this.connections.push(connection)

      // trigger event
      onConnect && onConnect(connection)

      // when this client disconnects
      socket.on('disconnect', () => {
        // remove them from the list
        this.connections.remove(connection)

        // trigger event
        onDisconnect && onDisconnect(connection)
      })

      // when we receive a command from the client
      socket.on('command', ({ type, payload }) => {
        this.messageId++
        const date = new Date()
        const fullCommand = { type, payload, messageId: this.messageId, date }
        onCommand(fullCommand)
        this.commands.addCommand(fullCommand)
      })

      // resend the subscriptions to the client upon connecting
      this.stateValuesSendSubscriptions()
    })
  }

  /**
   * Starts the server.
   */
  start () {
    this.started = true
    const { port, onStart } = this.options

    // start listening
    this.io = socketIO(port)

    // configure socket.io to do its thing
    this.registerCallbacks()

    // trigger the start message
    onStart && onStart()

    return this
  }

  /**
   * Stops the server.
   */
  stop () {
    const { onStop } = this.options
    this.started = false
    R.forEach(s => s.connected && s.disconnect(), R.pluck('socket', this.connections))
    this.io.close()

    // trigger the stop message
    onStop && onStop()

    return this
  }

  /**
   * Sends a command to the client
   */
  send (type, payload) {
    this.io.sockets.emit('command', { type, payload })
  }

  /**
   * Sends a request to the client for state values.
   */
  stateValuesRequest (path) {
    this.send('state.values.request', { path })
  }

  /**
   * Sends a request to the client for keys for a state object.
   */
  stateKeysRequest (path) {
    this.send('state.keys.request', { path })
  }

  /**
   * Dispatches an action through to the state.
   */
  stateActionDispatch (action) {
    this.send('state.action.dispatch', { action })
  }

  /**
   * Sends a list of subscribed paths to the client for state subscription.
   */
  stateValuesSendSubscriptions () {
    this.send('state.values.subscribe', { paths: this.subscriptions })
  }

  /**
   * Subscribe to a path in the client's state.
   */
  stateValuesSubscribe (path) {
    // prevent duplicates
    if (R.contains(path, this.subscriptions)) return
    // subscribe
    this.subscriptions.push(path)
    this.stateValuesSendSubscriptions()
  }

  /**
   * Unsubscribe from this path.
   */
  stateValuesUnsubscribe (path) {
    // if it doesn't exist, jet
    if (!R.contains(path, this.subscriptions)) return
    this.subscriptions = R.without([path], this.subscriptions)
    this.stateValuesSendSubscriptions()
  }

  /**
   * Clears the subscriptions.
   */
  stateValuesClearSubscriptions () {
    this.subscriptions = []
    this.stateValuesSendSubscriptions()
  }

}

export default Server

// convenience factory function
export const createServer = (options) => {
  const server = new Server()
  server.configure(options)
  return server
}
