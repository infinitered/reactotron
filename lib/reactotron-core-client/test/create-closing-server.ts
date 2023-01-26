import * as WebSocket from "ws"

/**
 * A server which shuts down after somebody connects.
 * 
 * @param port The port to listen on
 * @param done Calls after we close.
 */
export function createClosingServer(port: number, onDone?: () => void) {
  const wss = new WebSocket.Server({ port })
  wss.on("connection", () => {
    wss.close()
    onDone && onDone()
  })
}
