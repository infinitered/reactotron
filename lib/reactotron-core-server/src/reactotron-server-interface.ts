/**
 * TODO: move this interface to reactotron-core-contract
 */

import { ServerEventKey } from "reactotron-core-contract"

import { WebSocket } from "ws"

/**
 * A server which can accept connections.
 */
export interface ReactotronServerInterface {
  /**
   * A set of connected clients.
   */
  clients: Set<WebSocket>

  /**
   * Sends a message to all connected clients.
   */
  sendAll(type: ServerEventKey, payload: any): void

  /**
   * On events
   */
  on(type: string, handler: (event: any) => void): void

  onConnection(handler: (socket: WebSocket, address: string) => void): void

  /**
   * Keepalive ping.
   */
  ping(): void

  /**
   * Closes the server.
   */
  close(): void
}
