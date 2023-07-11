import * as WebSocket from "ws"

/**
 * Configuration options for the Reactotron server.
 */
export interface ServerOptions {
  /**
   * Which port to listen to.  Default: 9090.
   */
  port: number

  /**
   * Web Socket Secure Configuration
   */
  wss?: WssServerOptions
}

export interface PfxServerOptions {
  /**
   * Path to a PFX file.
   */
  pathToPfx: string
  /**
   * Passphrase, if required, of the PFX file.
   */
  passphrase?: string
}

export interface CertServerOptions {
  /**
   * Path to a signing cert file.
   */
  pathToCert: string
  /**
   * Path to a the corresponding key of the cert file.
   */
  pathToKey: string
  /**
   * Passphrase, if required, of the key file.
   */
  passphrase?: string
}

export type WssServerOptions = PfxServerOptions | CertServerOptions

/**
 * A client which is in the process of connecting.
 */
export interface PartialConnection {
  /**
   * The unique id of the client.
   */
  id: number

  /**
   * The ip address.
   */
  address: string

  /**
   * The connecting web socket.
   */
  socket: WebSocket
}

/**
 * One of the events which be subscribed to.
 */
export type ServerEvent =
  /**
   * When a command arrives from a client.
   */
  | "command"

  /**
   * The server has started.
   */
  | "start"

  /**
   * The server has stopped.
   */
  | "stop"

  /**
   * A client has connected.
   */
  | "connect"

  /**
   * A client has connected and provided us the initial detail we want.
   */
  | "connectionEstablished"

  /**
   * A client has disconnected.
   */
  | "disconnect"

export type WebSocketEvent = (socket: WebSocket) => void

export type ServerEventMap = Record<ServerEvent, any>
