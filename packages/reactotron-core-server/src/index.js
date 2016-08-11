import R from 'ramda'
import Commands from './commands'
import validate from './validation'
import { observable, computed } from 'mobx'
import defaultTransport from './transport'

const DEFAULTS = {
  port: 9090, // the port to live (required)
  onCommand: command => null, // handles inbound commands
  onStart: () => null, // handles inbound commands
  onStop: () => null, // handles inbound commands
  onConnect: connection => null, // notify connections
  onDisconnect: connection => null // notify disconnections
}

class Server {

  // the configuration options
  @observable options = R.merge({}, DEFAULTS)
  started = false
  messageId = 0
  subscriptions = []

  /**
   * Holds the transport which bridges this server to a real socket.  We need
   * this for electron to proxy ipc between the main process & renderer.
   */
  transport = null

  /**
   * The function which creates a transport.  Called on start().
   */
  createTransport

  /**
   * Holds the commands the client has sent.
   */
  commands = new Commands()

  /**
   * Holds the currently connected clients.
   */
  @observable connections = []

  /**
   * How many people are connected?
   */
  @computed get connectionCount () {
    return R.length(this.connections)
  }

  constructor (createTransport) {
    if (createTransport) {
      this.createTransport = createTransport
    } else {
      this.createTransport = defaultTransport
    }
    this.send = this.send.bind(this)
  }

  findConnectionById = connection => R.find(R.propEq('id', connection), this.connections)

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
   * Starts the server.
   */
  start () {
    this.started = true
    const { port, onStart } = this.options
    const { onCommand, onConnect, onDisconnect } = this.options
    let partialConnections = []

    // start listening
    this.transport = this.createTransport({
      port,

      // fires when we the transport receives a new connection
      onConnect: ({id, address}) => {
        const connection = { id, address }
        partialConnections.push(connection)
        onConnect && onConnect(connection)

        // resend the subscriptions to the client upon connecting
        this.stateValuesSendSubscriptions()
      },

      // fires when we say goodbye to someone
      onDisconnect: id => {
        const connection = this.findConnectionById(id)
        this.connections.remove(connection)
        onDisconnect && onDisconnect(connection)
      },

      // fires when the transport gives us a connection
      onCommand: (id, {type, payload}) => {
        this.messageId++
        const date = new Date()
        const fullCommand = { type, payload, messageId: this.messageId, date }

        // for client intros
        if (type === 'client.intro') {
          const partialConnection = R.find(R.propEq('id', id), partialConnections)
          partialConnections = R.without([partialConnection], partialConnections)
          // bestow the payload onto the connection
          const connection = { ...partialConnection, ...payload }
          // then trigger the connection
          this.connections.push(connection)
        }

        onCommand(fullCommand)
        this.commands.addCommand(fullCommand)
      }
    })

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
    this.transport.stop()
    this.transport.close()

    // trigger the stop message
    onStop && onStop()

    return this
  }

  /**
   * Sends a command to the client
   */
  send (type, payload) {
    this.transport.send('command', { type, payload })
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
export const createServer = (options, createTransport) => {
  const server = new Server(createTransport)
  server.configure(options)
  return server
}

export const createDefaultTransport = defaultTransport
