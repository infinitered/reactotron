import * as WebSocket from "ws"
import { Command } from "./command"

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
export const ServerEvent = {
  /**
   * When a command arrives from a client.
   */
  command: "command",
  /**
   * The server has started.
   */
  start: "start",
  /**
   * The server has stopped.
   */
  stop: "stop",
  /**
   * A client has connected.
   */
  connect: "connect",
  /**
   * A client has connected and provided us the initial detail we want.
   */
  connectionEstablished: "connectionEstablished",
  /**
   * A client has disconnected.
   */
  disconnect: "disconnect",
} as const

export type ServerEventKey = keyof typeof ServerEvent

type StartPayload = any
type StopPayload = any
type ConnectPayload = PartialConnection
type ConnectionEstablishedPayload = any
type DisconnectPayload = any

export type ServerEventMap = {
  [ServerEvent.command]: Command
  [ServerEvent.start]: StartPayload
  [ServerEvent.stop]: StopPayload
  [ServerEvent.connect]: ConnectPayload
  [ServerEvent.connectionEstablished]: ConnectionEstablishedPayload
  [ServerEvent.disconnect]: DisconnectPayload
}

export type WebSocketEvent = (socket: WebSocket) => void
