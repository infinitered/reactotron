import { merge, find, propEq, without, contains, forEach, pluck, reject } from 'ramda'
import { Server as WebSocketServer, OPEN } from 'ws'
import * as mitt from 'mitt'
import validate from './validation'
import { repair } from './repair-serialization'
import {
  ServerOptions,
  PartialConnection,
  ServerEvent,
  CommandEvent,
  WebSocketEvent,
} from './types'

/**
 * The default server options.
 */
const DEFAULTS: ServerOptions = {
  port: 9090,
}

/**
 * The Reactotron server.
 */
export default class Server {
  /**
   * An event emitter which fires events from connected clients.
   */
  emitter = new mitt()

  /**
   * Additional server configuration.
   */
  options: ServerOptions = merge({}, DEFAULTS)

  /**
   * A unique id which is assigned to each inbound message.
   */
  messageId = 0

  /**
   * Which redux state locations we are subscribing to.
   */
  subscriptions: string[] = []

  /**
   * Clients who are in the process of connecting but haven't yet handshaked.
   */
  partialConnections: PartialConnection[] = []

  /**
   * The web socket.
   */
  wss: WebSocketServer

  /**
   * Holds the currently connected clients.
   */
  connections = []

  /**
   * Have we started the server?
   */
  started: boolean = false

  /**
   * Set the configuration options.
   */
  configure(options: ServerOptions = DEFAULTS) {
    // options get merged & validated before getting set
    const newOptions = merge(this.options, options)
    validate(newOptions)
    this.options = newOptions
    return this
  }

  /**
   * Listens to an event.
   */
  on(event: ServerEvent, handler: CommandEvent | WebSocketEvent) {
    this.emitter.on(event, handler)
  }

  /**
   * Turns off an event listener
   */
  off(type: ServerEvent, handler: (any) => any) {
    this.emitter.off(type, handler)
  }

  /**
   * Starts the server
   */
  start = () => {
    const { port } = this.options

    // start listening
    this.wss = new WebSocketServer({ port })

    // register events
    this.wss.on('connection', (socket, request) => {
      // a wild client appears
      const partialConnection = {
        id: (socket as any).id, // issue
        address: request.socket.remoteAddress,
        socket,
      }

      // tuck them away in a "almost connected status"
      this.partialConnections.push(partialConnection)

      // trigger onConnect
      this.emitter.emit('connect', partialConnection)

      // when this client disconnects
      socket.on('disconnect', () => {
        // remove them from the list partial list
        this.partialConnections = reject(
          propEq('id', (socket as any).id),
          this.partialConnections,
        ) as any

        // remove them from the main connections list
        const severingConnection = find(propEq('id', (socket as any).id), this.connections)
        if (severingConnection) {
          (this.connections as any).remove(severingConnection)
          this.emitter.emit('disconnect', severingConnection)
        }
      })

      // when we receive a command from the client
      socket.on('message', incoming => {
        const message = JSON.parse(incoming as string)
        repair(message)
        const { type, important, payload } = message
        this.messageId++
        const date = new Date()
        const fullCommand = {
          type,
          important,
          payload,
          messageId: this.messageId,
          date,
        }

        // for client intros
        if (type === 'client.intro') {
          // find them in the partial connection list
          const partConn = find(propEq('id', (socket as any).id), this.partialConnections) as any

          // add their address in
          fullCommand.payload.address = partConn.address

          // remove them from the partial connections list
          this.partialConnections = reject(
            propEq('id', (socket as any).id),
            this.partialConnections,
          ) as any

          // bestow the payload onto the connection
          const connection = merge(payload, {
            id: (socket as any).id,
            address: partConn.address,
          })

          // then trigger the connection
          this.connections.push(connection)
        }

        // refresh subscriptions
        if (type === 'state.values.change') {
          this.subscriptions = pluck('path', payload.changes || [])
        }

        // assign a name to the backups since the client doesn't pass one.  without it, we have to
        // call extendObservable instead of a standard assignment, which is very confusing.
        if (type === 'state.backup.response') {
          fullCommand.payload.name = null
        }

        this.emitter.emit('command', fullCommand)
      })

      // resend the subscriptions to the client upon connecting
      this.stateValuesSendSubscriptions()
    })

    // trigger the start message
    this.emitter.emit('start')

    this.started = true

    return this
  }

  /**
   * Stops the server
   */
  stop() {
    forEach(
      s => s && (s as any).connected && (s as any).disconnect(),
      pluck('socket', this.connections),
    )
    this.wss.close()

    // trigger the stop message
    this.emitter.emit('stop')
    this.started = false

    return this
  }

  /**
   * Sends a command to the client
   */
  send = (type, payload) => {
    this.wss.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify({ type, payload }))
      }
    })
  }

  /**
   * Sends a list of subscribed paths to the client for state subscription.
   */
  stateValuesSendSubscriptions() {
    this.send('state.values.subscribe', { paths: this.subscriptions })
  }

  /**
   * Subscribe to a path in the client's state.
   */
  stateValuesSubscribe(path) {
    // prevent duplicates
    if (contains(path, this.subscriptions)) {
      return
    }

    // subscribe
    this.subscriptions.push(path)
    this.stateValuesSendSubscriptions()
  }

  /**
   * Unsubscribe from this path.
   */
  stateValuesUnsubscribe(path) {
    // if it doesn't exist, jet
    if (!contains(path, this.subscriptions)) {
      return
    }

    this.subscriptions = without([path], this.subscriptions)
    this.stateValuesSendSubscriptions()
  }

  /**
   * Clears the subscriptions.
   */
  stateValuesClearSubscriptions() {
    this.subscriptions = []
    this.stateValuesSendSubscriptions()
  }

  /**
   * Sends a custom message to the client.
   *
   * @param {string} value The string to send
   */
  sendCustomMessage(value) {
    this.send('custom', value)
  }
}

// convenience factory function
export const createServer = (options?: ServerOptions) => {
  const server = new Server()
  server.configure(options)
  return server
}
