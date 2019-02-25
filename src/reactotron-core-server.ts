import { merge, find, propEq, without, contains, forEach, pluck, reject, equals } from "ramda"
import { createServer as createHttpsServer, ServerOptions as HttpsServerOptions } from "https"
import { Server as WebSocketServer, OPEN } from "ws"
import * as Mitt from "mitt"
import validate from "./validation"
import { repair } from "./repair-serialization"
import {
  ServerOptions,
  PartialConnection,
  ServerEvent,
  CommandEvent,
  WebSocketEvent,
  PfxServerOptions,
  WssServerOptions,
} from "./types"
import { readFileSync } from "fs"

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

function isPfxServerOptions(wssOptions: WssServerOptions): wssOptions is PfxServerOptions {
  return !!(wssOptions as PfxServerOptions).pathToPfx
}

function buildHttpsServerOptions(wssOptions: WssServerOptions): HttpsServerOptions {
  if (!wssOptions) {
    return undefined
  }
  if (isPfxServerOptions(wssOptions)) {
    return {
      pfx: readFileSync(wssOptions.pathToPfx),
      passphrase: wssOptions.passphrase,
    }
  }
  if (!wssOptions.pathToCert) {
    return undefined
  }
  return {
    cert: readFileSync(wssOptions.pathToCert),
    key: wssOptions.pathToKey ? readFileSync(wssOptions.pathToKey) : undefined,
    passphrase: wssOptions.passphrase,
  }
}

/**
 * The Reactotron server.
 */
export default class Server {
  /**
   * An event emitter which fires events from connected clients.
   */
  emitter = new Mitt()

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
   * Keep alive interval to be running while the server is up.
   */
  keepAlive: NodeJS.Timer

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
    const httpsServerOptions = buildHttpsServerOptions(this.options.wss)
    if (!httpsServerOptions) {
      this.wss = new WebSocketServer({ port })
    } else {
      const server = createHttpsServer(httpsServerOptions)
      this.wss = new WebSocketServer({ server })
      server.listen(port)
    }

    if (this.keepAlive) {
      clearInterval(this.keepAlive)
    }

    // In the future we should bake this in more and use it to clean up dropped connections
    this.keepAlive = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        ws.ping(() => {});
      });
    }, 30000)

    // register events
    this.wss.on("connection", (socket, request) => {
      const thisConnectionId = this.connectionId++

      // a wild client appears
      const partialConnection = {
        id: thisConnectionId,
        address: request.socket.remoteAddress,
        socket,
      }

      // tuck them away in a "almost connected status"
      this.partialConnections.push(partialConnection)

      // trigger onConnect
      this.emitter.emit("connect", partialConnection)

      socket.on("error", error => console.log("ERR", error));

      // when this client disconnects
      socket.on("close", () => {
        console.log('Client disconnected');
        // remove them from the list partial list
        this.partialConnections = reject(
          propEq("id", thisConnectionId),
          this.partialConnections,
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
      socket.on("message", incoming => {
        const message = JSON.parse(incoming as string)
        repair(message)
        const { type, important, payload, deltaTime = 0 } = message
        this.messageId++

        const fullCommand = {
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
            this.partialConnections,
          ) as any

          let connectionClientId = message.payload.clientId

          if (!connectionClientId) {
            connectionClientId = createGuid()

            socket.send(JSON.stringify({
              type: "setClientId",
              payload: connectionClientId,
            }))
          } else {
            // Check if we already have this connection
            const currentWssConnections = Array.from(this.wss.clients)
            const currentClientConnections = currentWssConnections.filter(c => (c as any).clientId === connectionClientId)

            for (let i = 0; i < currentClientConnections.length; i++) {
              setTimeout(currentClientConnections[i].close, 500) // Defer this for a small amount of time because reasons.

              const severingConnection = find(propEq("clientId", connectionClientId), this.connections)
              if (severingConnection) {
                this.connections = reject(propEq("clientId", severingConnection.clientId), this.connections)
              }
            }
          }

          (socket as any).clientId = connectionClientId
          fullCommand.clientId = connectionClientId

          // bestow the payload onto the connection
          const connection = merge(payload, {
            id: thisConnectionId,
            address: partConn.address,
            clientId: fullCommand.clientId,
          })

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
      })

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
      s => s && (s as any).connected && (s as any).disconnect(),
      pluck("socket", this.connections),
    )

    if (this.keepAlive) {
      clearInterval(this.keepAlive)
    }

    this.wss.close()

    // trigger the stop message
    this.emitter.emit("stop")
    this.started = false

    return this
  }

  /**
   * Sends a command to the client
   */
  send = (type, payload, clientId?) => {
    this.wss.clients.forEach(client => {
      if (client.readyState === OPEN && (!clientId || (client as any).clientId === clientId)) {
        client.send(JSON.stringify({ type, payload }))
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
  stateValuesSubscribe(path) {
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
  sendCustomMessage(value, clientId?) {
    this.send("custom", value, clientId)
  }
}

// convenience factory function
export const createServer = (options?: ServerOptions) => {
  const server = new Server()
  server.configure(options)
  return server
}
