import { merge, find, propEq, without, contains, pluck, equals } from "ramda"
import TcpSocket from "react-native-tcp-socket"

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

type Mitt = typeof import("mitt").default // I'm so sorry, Jest made me do this :'(
const mitt: Mitt = require("mitt")

type Connection = {
  id: number
  address: string
  socket: TcpSocket.Socket
  clientId?: string
  [key: string]: any
}

/**
 * The default server options.
 */
const DEFAULTS: ServerOptions = {
  port: 9090,
  host: "localhost",
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
export default class MacOSServer {
  /**
   * An event emitter which fires events from connected clients.
   */
  emitter = mitt<ServerEventMap>()

  /**
   * Additional server configuration.
   */
  options: ServerOptions = merge({}, DEFAULTS)

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
   * The web socket server.
   */
  server!: TcpSocket.Server

  /**
   * Holds the currently connected and partially connected clients.
   */
  _connections: Connection[] = []

  /**
   * Have we started the server?
   */
  started = false

  /**
   * Keep alive interval to be running while the server is up.
   */
  keepAlive!: ReturnType<typeof setInterval>

  /**
   * Returns the list of all connected clients.
   */
  get connections() {
    return this._connections.filter((c) => Boolean(c.clientId))
  }

  /**
   * Returns the list of partially connected clients.
   */
  get partialConnections() {
    return this._connections.filter((c) => !Boolean(c.clientId))
  }

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
  on(event: ServerEventKey, handler: CommandEvent | WebSocketEvent) {
    this.emitter.on(event, handler)
  }

  /**
   * Turns off an event listener
   */
  off(type: ServerEventKey, handler: (a: any) => any) {
    this.emitter.off(type, handler)
  }

  /**
   * Starts the server
   */
  start = () => {
    const { port, host } = this.options

    this.server = TcpSocket.createServer((socket) => {
      const thisConnectionId = this.connectionId++

      socket.setKeepAlive(true, 30000)

      // a wild client appears
      const partialConnection: PartialConnection = {
        id: thisConnectionId,
        address: socket.remoteAddress!,
        socket,
      }

      // tuck them away in a "almost connected status"
      this._connections.push(partialConnection)

      // trigger onConnect
      this.emitter.emit("connect", partialConnection)

      socket.on("error", (error) => console.log("ERR", error))

      // when this client disconnects
      socket.on("close", () => {
        // remove them from the list partial list
        this._connections = this._connections.filter((c) => c.id !== thisConnectionId)

        const severingConnection = this.connections.find((c) => c.id === thisConnectionId)
        if (severingConnection) {
          this._connections = this._connections.filter((c) => c.id !== thisConnectionId)
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
      socket.on("data", (incoming) => {
        const message = JSON.parse(incoming.toString())
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

          let connectionClientId: string | undefined = message.payload.clientId

          if (!connectionClientId) {
            connectionClientId = createGuid()

            socket.write(
              JSON.stringify({
                type: "setClientId",
                payload: connectionClientId,
              })
            )
          } else {
            // Check if we already have this connection
            const currentWssConnections = Array.from(this.connections.map((c) => c.socket))
            const currentClientConnections = currentWssConnections.filter(
              (c) => (c as any).clientId === connectionClientId
            )

            for (let i = 0; i < currentClientConnections.length; i++) {
              setTimeout(currentClientConnections[i].destroy, 500) // Defer this for a small amount of time because reasons.

              const severingConnection = this._connections.find(
                (c) => c.clientId === connectionClientId
              )
              if (severingConnection) {
                this._connections = this._connections.filter(
                  (c) => c.clientId !== severingConnection.clientId
                )
              }
            }
          }

          ;(socket as any).clientId = connectionClientId
          fullCommand.clientId = connectionClientId

          // bestow the payload onto the connection
          const connection: Connection = {
            ...payload,
            id: thisConnectionId,
            address: partConn.address,
            clientId: fullCommand.clientId,
          }

          // then trigger the connection
          this._connections.push(connection)
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
      })

      // resend the subscriptions to the client upon connecting
      this.stateValuesSendSubscriptions()
    }).listen({ port, host: host! })

    // trigger the start message
    this.emitter.emit("start")

    this.started = true

    return this
  }

  /**
   * Stops the server
   */
  stop() {
    this._connections.forEach((c) => c.socket?.destroy())

    this.server.close()

    // trigger the stop message
    this.emitter.emit("stop")
    this.started = false

    return this
  }

  /**
   * Sends a command to the client
   */
  send = (type: string, payload: any, clientId?: string) => {
    this.connections.forEach(({ socket }) => {
      if (socket.readyState === "open" && (!clientId || (socket as any).clientId === clientId)) {
        socket.write(JSON.stringify({ type, payload }))
      }
    })
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
  sendCustomMessage(value: any, clientId?: string) {
    this.send("custom", value, clientId)
  }
}

// convenience factory function
export const createMacOSServer = (options?: ServerOptions) => {
  const server = new MacOSServer()
  server.configure(options)
  return server
}
