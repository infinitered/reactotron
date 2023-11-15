import { find, propEq, without, contains, forEach, pluck, reject, equals } from "ramda"

import { createReactotronServer } from "./reactotron-server"

import {
  ServerEventMap,
  ServerOptions,
  PartialConnection,
  CommandEvent,
  WebSocketEvent,
  ServerEventKey,
  Command,
} from "reactotron-core-contract"
import validate from "./validation"
import { repair } from "./repair-serialization"
import { ReactotronServerInterface } from "./reactotron-server-interface"

type Mitt = typeof import("mitt").default // I'm so sorry, Jest made me do this :'(
const mitt: Mitt = require("mitt")

/**
 * The default server options.
 */
const DEFAULTS: ServerOptions = {
  port: 9090,
}

function createGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
}

/**
 * The Reactotron server.
 */
export default class Server {
  /**
   * An event emitter which fires events from connected clients.
   */
  emitter = mitt<ServerEventMap>()

  /**
   * Additional server configuration.
   */
  options: ServerOptions = { ...DEFAULTS }

  /**
   * A unique id which is assigned to each inbound message.
   */
  messageId = 0

  /**
   * A unique id which is assigned to each inbound connection.
   */
  connectionId = 0

  /**
   * Which redux state locations we are subscribing to.
   */
  subscriptions: string[] = []

  /**
   * Clients who are in the process of connecting but haven't yet handshaked.
   */
  partialConnections: PartialConnection[] = []

  /**
   * The web socket server.
   */
  server: ReactotronServerInterface

  /**
   * Holds the currently connected clients.
   */
  connections = []

  /**
   * Have we started the server?
   */
  started = false

  /**
   * Keep alive interval to be running while the server is up.
   */
  keepAlive: ReturnType<typeof setInterval>

  /**
   * Set the configuration options.
   */
  configure(options: ServerOptions = DEFAULTS) {
    // options get merged & validated before getting set
    const newOptions = { ...this.options, ...options }
    validate(newOptions)
    this.options = newOptions
    return this
  }

  /**
   * Listens to an event.
   */
  on(event: ServerEventKey, handler: CommandEvent | WebSocketEvent) {
    this.emitter.on(event, handler)
  }

  /**
   * Turns off an event listener
   */
  off(type: ServerEventKey, handler: (any) => any) {
    this.emitter.off(type, handler)
  }

  /**
   * Starts the server
   */
  start = () => {
    this.server = createReactotronServer(this.options)

    if (this.keepAlive) {
      clearInterval(this.keepAlive)
    }

    // In the future we should bake this in more and use it to clean up dropped connections
    this.keepAlive = setInterval(() => this.server.ping(), 30000)

    // register events
    this.server.onConnection((socket, address: string) => {
      const thisConnectionId = this.connectionId++

      // a wild client appears
      const partialConnection = { id: thisConnectionId, address, socket } as PartialConnection

      // tuck them away in a "almost connected status"
      this.partialConnections.push(partialConnection)

      // trigger onConnect
      this.emitter.emit("connect", partialConnection)

      socket.on("error", (error) => console.log("ERR", error))

      // when this client disconnects
      socket.on("close", () => {
        // remove them from the list partial list
        this.partialConnections = reject(
          propEq("id", thisConnectionId),
          this.partialConnections
        ) as any

        // remove them from the main connections list
        const severingConnection = find(propEq("id", thisConnectionId), this.connections)
        if (severingConnection) {
          this.connections = reject(propEq("id", severingConnection.id), this.connections)
          this.emitter.emit("disconnect", severingConnection)
        }
      })

      const extractOrCreateDate = (dateString?: string) => {
        if (!dateString) return new Date()
        try {
          return new Date(Date.parse(dateString))
        } catch {
          return new Date()
        }
      }

      // when we receive a command from the client
      const onMessage = (incoming: string) => {
        const message = JSON.parse(incoming)
        repair(message)
        const { type, important, payload, deltaTime = 0 } = message
        this.messageId++

        const fullCommand: Command = {
          type,
          important,
          payload,
          connectionId: thisConnectionId,
          messageId: this.messageId,
          date: extractOrCreateDate(message.date),
          deltaTime,
          clientId: (socket as any).clientId,
        }

        // for client intros
        if (type === "client.intro") {
          // find them in the partial connection list
          const partConn = find(propEq("id", thisConnectionId), this.partialConnections) as any

          // add their address in
          fullCommand.payload.address = partConn.address

          // remove them from the partial connections list
          this.partialConnections = reject(
            propEq("id", thisConnectionId),
            this.partialConnections
          ) as any

          let connectionClientId = message.payload.clientId

          if (!connectionClientId) {
            connectionClientId = createGuid()

            socket.send(
              JSON.stringify({
                type: "setClientId",
                payload: connectionClientId,
              })
            )
          } else {
            // Check if we already have this connection
            const currentWssConnections = Array.from(this.server.clients)
            const currentClientConnections = currentWssConnections.filter(
              (c) => (c as any).clientId === connectionClientId
            )

            for (let i = 0; i < currentClientConnections.length; i++) {
              setTimeout(currentClientConnections[i].close, 500) // Defer this for a small amount of time because reasons.

              const severingConnection = this.connections.find(
                (c) => c.clientId === connectionClientId
              )
              if (severingConnection) {
                this.connections = this.connections.filter((c) => c.clientId !== connectionClientId)
              }
            }
          }

          ;(socket as any).clientId = connectionClientId
          fullCommand.clientId = connectionClientId

          // bestow the payload onto the connection
          const connection = {
            ...payload,
            id: thisConnectionId,
            address: partConn.address,
            clientId: fullCommand.clientId,
          }

          // then trigger the connection
          this.connections.push(connection)
          this.emitter.emit("connectionEstablished", connection)
        }

        // refresh subscriptions
        if (type === "state.values.change") {
          this.subscriptions = pluck("path", (payload.changes || []) as { path: string }[])
        }

        // assign a name to the backups since the client doesn't pass one.  without it, we have to
        // call extendObservable instead of a standard assignment, which is very confusing.
        if (type === "state.backup.response") {
          fullCommand.payload.name = null
        }

        this.emitter.emit("command", fullCommand)
      }
      // message is Node, data is React Native macOS
      socket.on("message", (data) => onMessage(data.toString()))
      socket.on("data", (data) => onMessage(data.toString()))

      // resend the subscriptions to the client upon connecting
      this.stateValuesSendSubscriptions()
    })

    // trigger the start message
    this.emitter.emit("start")

    this.started = true

    return this
  }

  /**
   * Stops the server
   */
  stop() {
    forEach(
      (s) => s && (s as any).connected && (s as any).disconnect(),
      pluck("socket", this.connections)
    )

    if (this.keepAlive) {
      clearInterval(this.keepAlive)
    }

    this.server.close()

    // trigger the stop message
    this.emitter.emit("stop")
    this.started = false

    return this
  }

  /**
   * Sends a command to the client
   */
  send = (type: any, payload: any, clientId?: string) => {
    this.server.sendAll(type, JSON.stringify({ type, payload, clientId }))
  }

  /**
   * Sends a list of subscribed paths to the client for state subscription.
   */
  stateValuesSendSubscriptions() {
    this.send("state.values.subscribe", { paths: this.subscriptions })
  }

  /**
   * Subscribe to a path in the client's state.
   */
  stateValuesSubscribe(path: string) {
    // prevent duplicates
    if (contains(path, this.subscriptions)) {
      return
    }

    // monitor the complete state when * (star selector) is entered
    if (equals(path, "*")) {
      this.subscriptions.push("")
    } else {
      this.subscriptions.push(path)
    }

    // subscribe
    this.stateValuesSendSubscriptions()
  }

  /**
   * Unsubscribe from this path.
   */
  stateValuesUnsubscribe(path: string) {
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
  sendCustomMessage(value: string, clientId?: string) {
    this.send("custom", value, clientId)
  }
}

// convenience factory function
export const createServer = (options?: ServerOptions) => {
  const server = new Server()
  server.configure(options)
  return server
}
