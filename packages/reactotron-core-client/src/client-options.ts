
/**
 * Configuration options for the Reactotron Client.
 */
export interface ClientOptions {
  /**
   * A function which returns a websocket.
   * 
   * This is over-engineered because we need the ability to create different
   * types of websockets for React Native, React, and NodeJS.  :|
   */
  createSocket?: (path?: string) => any

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
  plugins?: any[]

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
   * Deprecated.
   */
  userAgent?: string

  /**
   * Deprecated.
   */
  environment?: string

  /**
   * Deprecated.
   */
  reactotronVersion?: string
}
