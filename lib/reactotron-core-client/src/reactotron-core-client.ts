import * as WebSocket from "ws"
import { Command, CommandTypeKey } from "reactotron-core-contract"
import validate from "./validate"
import logger from "./plugins/logger"
import image from "./plugins/image"
import benchmark from "./plugins/benchmark"
import stateResponses from "./plugins/state-responses"
import apiResponse from "./plugins/api-response"
import clear from "./plugins/clear"
import repl from "./plugins/repl"
import serialize from "./serialize"
import { start } from "./stopwatch"
import { ClientOptions } from "./client-options"

export type { ClientOptions }
export { assertHasLoggerPlugin } from "./plugins/logger"
export type { LoggerPlugin } from "./plugins/logger"
export { assertHasStateResponsePlugin, hasStateResponsePlugin } from "./plugins/state-responses"
export type { StateResponsePlugin } from "./plugins/state-responses"

// #region Plugin Types
export interface LifeCycleMethods {
  onCommand?: (command: Command) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

type AnyFunction = (...args: any[]) => any
export interface Plugin<Client> extends LifeCycleMethods {
  features?: {
    [key: string]: AnyFunction
  }
  onPlugin?: (client: Client) => void
}

export type PluginCreator<Client> = (client: Client) => Plugin<Client>

export type InferFeatures<
  Client = ReactotronCore,
  PC extends PluginCreator<Client> = PluginCreator<Client>
> = PC extends (client: Client) => { features: infer U } ? U : never

export const corePlugins = [
  image(),
  logger(),
  benchmark(),
  stateResponses(),
  apiResponse(),
  clear(),
  repl(),
] satisfies PluginCreator<ReactotronCore>[]

export type InferPluginsFromCreators<Client, PC extends PluginCreator<Client>[]> = PC extends Array<
  infer P extends PluginCreator<Client>
>
  ? ReturnType<P>[]
  : never

type ExtractFeatures<T> = T extends { features: infer U } ? U : never
type PluginFeatures<Client, P extends PluginCreator<Client>> = ExtractFeatures<ReturnType<P>>
export type InferFeaturesFromPlugins<
  Client,
  Plugins extends PluginCreator<Client>[]
> = UnionToIntersection<PluginFeatures<Client, Plugins[number]>>

type InferFeaturesFromPlugin<Client, P extends PluginCreator<Client>> = UnionToIntersection<
  PluginFeatures<Client, P>
>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never
// #endregion

interface DisplayConfig {
  name: string
  value?: object | string | number | boolean | null | undefined
  preview?: string
  image?: string
  important?: boolean
}

export interface ReactotronCore {
  options: ClientOptions<this>
  plugins: Plugin<this>[]
  startTimer: () => () => number
  close: () => void
  send: <Type extends CommandTypeKey, Payload extends Command<Type>["payload"]>(
    type: Type,
    payload?: Payload,
    important?: boolean
  ) => void
  display: (config: DisplayConfig) => void
  onCustomCommand: <Args extends CustomCommandArg[] = CustomCommand["args"]>(
    config: CustomCommand<Args>
  ) => () => void | ((config: string, optHandler?: () => void) => () => void)
  /**
   * Set the configuration options.
   */
  configure: (
    options: ClientOptions<this>
  ) => ClientOptions<this>["plugins"] extends PluginCreator<this>[]
    ? this & InferFeaturesFromPlugins<this, ClientOptions<this>["plugins"]>
    : this

  use: <P extends PluginCreator<this>>(pluginCreator: P) => this & InferFeaturesFromPlugin<this, P>

  connect: () => this
}

type CorePluginFeatures = InferFeaturesFromPlugins<ReactotronCore, typeof corePlugins>

export interface Reactotron extends ReactotronCore, CorePluginFeatures {}

// these are not for you.
const reservedFeatures = [
  "configure",
  "connect",
  "connected",
  "options",
  "plugins",
  "send",
  "socket",
  "startTimer",
  "use",
] as const
type ReservedKeys = (typeof reservedFeatures)[number]
const isReservedFeature = (value: string): value is ReservedKeys =>
  reservedFeatures.some((res) => res === value)

function emptyPromise() {
  return Promise.resolve("")
}

export enum ArgType {
  String = "string",
}

export interface CustomCommandArg {
  name: string
  type: ArgType
}

export type CustomCommandArgs<Args extends CustomCommandArg[]> = UnionToIntersection<
  Args extends Array<infer U>
    ? U extends CustomCommandArg
      ? { [K in U as U["name"]]: U["type"] }
      : never
    : never
>

export interface CustomCommand<Args extends CustomCommandArg[] = CustomCommandArg[]> {
  id?: number
  command: string
  handler: (args?: CustomCommandArgs<Args>) => void

  title?: string
  description?: string
  args?: Args
}

export class ReactotronImpl implements ReactotronCore {
  // the configuration options
  options: ClientOptions<ReactotronCore>

  /**
   * Are we connected to a server?
   */
  connected = false

  /**
   * The socket we're using.
   */
  socket: WebSocket = null

  /**
   * Available plugins.
   */
  plugins: Plugin<this>[] = []

  /**
   * Messages that need to be sent.
   */
  sendQueue: string[] = []

  /**
   * Are we ready to start communicating?
   */
  isReady = false

  /**
   * The last time we sent a message.
   */
  lastMessageDate = new Date()

  /**
   * The registered custom commands
   */
  customCommands: CustomCommand[] = []

  /**
   * The current ID for custom commands
   */
  customCommandLatestId = 1

  /**
   * Starts a timer and returns a function you can call to stop it and return the elapsed time.
   */
  startTimer = () => start()

  /**
   * Set the configuration options.
   */
  configure(
    options: ClientOptions<this>
  ): ClientOptions<this>["plugins"] extends PluginCreator<this>[]
    ? this & InferFeaturesFromPlugins<this, ClientOptions<this>["plugins"]>
    : this {
    // options get merged & validated before getting set
    const newOptions = Object.assign(
      {
        createSocket: null,
        host: "localhost",
        port: 9090,
        name: "reactotron-core-client",
        secure: false,
        plugins: corePlugins,
        safeRecursion: true,
        onCommand: () => null,
        onConnect: () => null,
        onDisconnect: () => null,
      } satisfies ClientOptions<ReactotronCore>,
      this.options,
      options
    )
    validate(newOptions)
    this.options = newOptions

    // if we have plugins, let's add them here
    if (Array.isArray(this.options.plugins)) {
      this.options.plugins.forEach((p) => this.use(p))
    }

    return this as this & InferFeaturesFromPlugins<this, ClientOptions<this>["plugins"]>
  }

  close() {
    this.connected = false
    this.socket && this.socket.close && this.socket.close()
  }

  /**
   * Connect to the Reactotron server.
   */
  connect() {
    this.connected = true
    const {
      createSocket,
      secure,
      host,
      environment,
      port,
      name,
      client = {},
      getClientId,
    } = this.options
    const { onCommand, onConnect, onDisconnect } = this.options

    // establish a connection to the server
    const protocol = secure ? "wss" : "ws"
    const socket = createSocket(`${protocol}://${host}:${port}`)

    // fires when we talk to the server
    const onOpen = () => {
      // fire our optional onConnect handler
      onConnect && onConnect()

      // trigger our plugins onConnect
      this.plugins.forEach((p) => p.onConnect && p.onConnect())

      const getClientIdPromise = getClientId || emptyPromise

      getClientIdPromise().then((clientId) => {
        this.isReady = true
        // introduce ourselves
        this.send("client.intro", {
          environment,
          ...client,
          name,
          clientId,
          reactotronCoreClientVersion: "REACTOTRON_CORE_CLIENT_VERSION",
        })

        // flush the send queue
        while (this.sendQueue.length > 0) {
          const h = this.sendQueue[0]
          this.sendQueue = this.sendQueue.slice(1)
          this.socket.send(h)
        }
      })
    }

    // fires when we disconnect
    const onClose = () => {
      this.isReady = false
      // trigger our disconnect handler
      onDisconnect && onDisconnect()

      // as well as the plugin's onDisconnect
      this.plugins.forEach((p) => p.onDisconnect && p.onDisconnect())
    }

    const decodeCommandData = (data: unknown) => {
      if (typeof data === "string") {
        return JSON.parse(data)
      }

      if (Buffer.isBuffer(data)) {
        return JSON.parse(data.toString())
      }

      return data
    }

    // fires when we receive a command, just forward it off
    const onMessage = (data: any) => {
      const command = decodeCommandData(data)
      // trigger our own command handler
      onCommand && onCommand(command)

      // trigger our plugins onCommand
      this.plugins.forEach((p) => p.onCommand && p.onCommand(command))

      // trigger our registered custom commands
      if (command.type === "custom") {
        this.customCommands
          .filter((cc) => {
            if (typeof command.payload === "string") {
              return cc.command === command.payload
            }

            return cc.command === command.payload.command
          })
          .forEach((cc) =>
            cc.handler(typeof command.payload === "object" ? command.payload.args : undefined)
          )
      } else if (command.type === "setClientId") {
        this.options.setClientId && this.options.setClientId(command.payload)
      }
    }

    // this is ws style from require('ws') on node js
    if ("on" in socket && socket.on) {
      const nodeWebSocket = socket as WebSocket
      nodeWebSocket.on("open", onOpen)
      nodeWebSocket.on("close", onClose)
      nodeWebSocket.on("message", onMessage)
      // assign the socket to the instance
      this.socket = socket
    } else {
      // this is a browser
      const browserWebSocket = socket as WebSocket
      socket.onopen = onOpen
      socket.onclose = onClose
      socket.onmessage = (evt) => onMessage(evt.data)
      // assign the socket to the instance
      this.socket = browserWebSocket
    }

    return this
  }

  /**
   * Sends a command to the server
   */
  send = <Type extends CommandTypeKey, Payload extends Command<Type>["payload"]>(
    type: Type,
    payload?: Payload,
    important?: boolean
  ) => {
    // set the timing info
    const date = new Date()
    let deltaTime = date.getTime() - this.lastMessageDate.getTime()
    // glitches in the matrix
    if (deltaTime < 0) {
      deltaTime = 0
    }
    this.lastMessageDate = date

    const fullMessage = {
      type,
      payload,
      important: !!important,
      date: date.toISOString(),
      deltaTime,
    }

    const serializedMessage = serialize(fullMessage, this.options.proxyHack)

    if (this.isReady) {
      // send this command
      try {
        this.socket.send(serializedMessage)
      } catch {
        this.isReady = false
        console.log("An error occurred communicating with reactotron. Please reload your app")
      }
    } else {
      // queue it up until we can connect
      this.sendQueue.push(serializedMessage)
    }
  }

  /**
   * Sends a custom command to the server to displays nicely.
   */
  display(config: DisplayConfig) {
    const { name, value, preview, image: img, important = false } = config
    const payload = {
      name,
      value: value || null,
      preview: preview || null,
      image: img || null,
    }
    this.send("display", payload, important)
  }

  /**
   * Client libraries can hijack this to report errors.
   */
  reportError(this: any, error: Error) {
    this.error(error)
  }

  /**
   * Adds a plugin to the system
   */
  use(pluginCreator: PluginCreator<this>): this & PluginFeatures<this, typeof pluginCreator> {
    // we're supposed to be given a function
    if (typeof pluginCreator !== "function") {
      throw new Error("plugins must be a function")
    }

    // execute it immediately passing the send function
    const plugin = pluginCreator.bind(this)(this) as ReturnType<typeof pluginCreator>

    // ensure we get an Object-like creature back
    if (typeof plugin !== "object") {
      throw new Error("plugins must return an object")
    }

    // do we have features to mixin?
    if (plugin.features) {
      // validate
      if (typeof plugin.features !== "object") {
        throw new Error("features must be an object")
      }

      // here's how we're going to inject these in
      const inject = (key: string) => {
        // grab the function
        const featureFunction = plugin.features[key]

        // only functions may pass
        if (typeof featureFunction !== "function") {
          throw new Error(`feature ${key} is not a function`)
        }

        // ditch reserved names
        if (isReservedFeature(key)) {
          throw new Error(`feature ${key} is a reserved name`)
        }

        // ok, let's glue it up... and lose all respect from elite JS champions.
        this[key] = featureFunction
      }

      // let's inject
      Object.keys(plugin.features).forEach((key) => inject(key))
    }

    // add it to the list
    this.plugins.push(plugin)

    // call the plugins onPlugin
    plugin.onPlugin && typeof plugin.onPlugin === "function" && plugin.onPlugin.bind(this)(this)

    // chain-friendly
    return this as this & PluginFeatures<this, typeof pluginCreator>
  }

  onCustomCommand(config: CustomCommand | string, optHandler?: () => void): () => void {
    let command: string
    let handler: () => void
    let title: string
    let description: string
    let args: CustomCommandArg[]

    if (typeof config === "string") {
      command = config
      handler = optHandler
    } else {
      command = config.command
      handler = config.handler

      title = config.title
      description = config.description
      args = config.args
    }

    // Validations
    // Make sure there is a command
    if (!command) {
      throw new Error("A command is required")
    }

    // Make sure there is a handler
    if (!handler) {
      throw new Error(`A handler is required for command "${command}"`)
    }

    // Make sure the command doesn't already exist
    const existingCommands = this.customCommands.filter((cc) => cc.command === command)
    if (existingCommands.length > 0) {
      existingCommands.forEach((command) => {
        this.customCommands = this.customCommands.filter((cc) => cc.id !== command.id)

        this.send("customCommand.unregister", {
          id: command.id,
          command: command.command,
        })
      })
    }

    if (args) {
      const argNames = []

      args.forEach((arg) => {
        if (!arg.name) {
          throw new Error(`A arg on the command "${command}" is missing a name`)
        }

        if (argNames.indexOf(arg.name) > -1) {
          throw new Error(
            `A arg with the name "${arg.name}" already exists in the command "${command}"`
          )
        }

        argNames.push(arg.name)
      })
    }

    // Create this command handlers object
    const customHandler: CustomCommand = {
      id: this.customCommandLatestId,
      command,
      handler,
      title,
      description,
      args,
    }

    // Increment our id counter
    this.customCommandLatestId += 1

    // Add it to our array
    this.customCommands.push(customHandler)

    this.send("customCommand.register", {
      id: customHandler.id,
      command: customHandler.command,
      title: customHandler.title,
      description: customHandler.description,
      args: customHandler.args,
    })

    return () => {
      this.customCommands = this.customCommands.filter((cc) => cc.id !== customHandler.id)

      this.send("customCommand.unregister", {
        id: customHandler.id,
        command: customHandler.command,
      })
    }
  }
}

// convenience factory function
export function createClient<Client extends ReactotronCore = ReactotronCore>(
  options?: ClientOptions<Client>
) {
  const client = new ReactotronImpl()
  return client.configure(options as unknown) as unknown as Client
}
