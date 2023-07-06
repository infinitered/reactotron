import type { LifeCycleMethods, PluginCreator } from "./reactotron-core-client"
import * as NodeWebSocket from "ws"

type BrowserWebSocket = WebSocket

/**
 * Configuration options for the Reactotron Client.
 */
export interface ClientOptions<Client> extends LifeCycleMethods {
  /**
   * A function which returns a websocket.
   *
   * This is over-engineered because we need the ability to create different
   * types of websockets for React Native, React, and NodeJS.  :|
   */
  createSocket?: ((path: string) => BrowserWebSocket) | ((path: string) => NodeWebSocket)

  /**
   * The hostname or ip address of the server.  Default: localhost.
   */
  host?: string

  /**
   * The port to connect to the server on.  Default: 9090.
   */
  port?: number

  /**
   * The name of this client. Usually the app name.
   */
  name?: string

  /**
   * Will we be connecting via SSL?
   */
  secure?: boolean

  /**
   * A list of plugins.
   */
  plugins?: PluginCreator<Client>[]

  /**
   * Performs safety checks when serializing.  Default: true.
   *
   * Will do things like:
   * - remap falsy values to transport-friendly version
   * - remove any circular dependencies
   * - remap functions to something that shows their name
   *
   * Hooray for JavaScript!
   */
  safeRecursion?: boolean

  /**
   * Fires when the server sends a command.
   */
  onCommand?: (command: any) => void

  /**
   * Fires when we connect to the server.
   */
  onConnect?: () => void

  /**
   * Fires when we disconnect from the server.
   */
  onDisconnect?: () => void

  /**
   * The NODE_ENV environment, if any.
   */
  environment?: string

  /**
   * A way for the client libraries to identify themselves.
   */
  client?: Record<string, string | number | boolean>

  /**
   * Save the client id provided by the server
   */
  setClientId?: (clientId: string) => Promise<void>

  /**
   * Get the client id provided by the server
   */
  getClientId?: () => Promise<string>

  proxyHack?: boolean
}
