import { createServer as createHttpsServer, ServerOptions as HttpsServerOptions } from "https"
import {
  ServerOptions,
  PfxServerOptions,
  WssServerOptions,
  ServerEventKey,
} from "reactotron-core-contract"
import { Server as WebSocketServer, OPEN, WebSocket } from "ws"
import { readFileSync } from "fs"
import { ReactotronServerInterface } from "./reactotron-server-interface"

export const socketServerType = "node"

class ReactotronServer implements ReactotronServerInterface {
  wss: WebSocketServer
  on: (type: string, handler: (event: any) => void) => void
  close: () => void
  clients: Set<WebSocket>

  constructor(wss: WebSocketServer) {
    this.wss = wss

    // pass through some methods directly
    this.on = this.wss.on
    this.close = this.wss.close
    this.clients = this.wss.clients
  }

  onConnection(handler: (socket: WebSocket, address: string) => void) {
    this.wss.on("connection", (socket, request) => {
      handler(socket, request.socket.remoteAddress)
    })
  }

  sendAll(type: ServerEventKey, payload: any, clientId?: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === OPEN && (!clientId || (client as any).clientId === clientId)) {
        client.send(JSON.stringify({ type, payload }))
      }
    })
  }

  ping() {
    this.wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.ping()
      }
    })
  }
}

export function createReactotronServer(options: ServerOptions): ReactotronServer {
  let wss: WebSocketServer

  const { port } = options
  const httpsServerOptions = buildHttpsServerOptions(options.wss)
  if (!httpsServerOptions) {
    wss = new WebSocketServer({ port })
  } else {
    const server = createHttpsServer(httpsServerOptions)
    wss = new WebSocketServer({ server })
    server.listen(port)
  }

  const reactotronServer = new ReactotronServer(wss)

  return reactotronServer
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

function isPfxServerOptions(wssOptions: WssServerOptions): wssOptions is PfxServerOptions {
  return !!(wssOptions as PfxServerOptions).pathToPfx
}
