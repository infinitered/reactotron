import * as WebSocket from "ws"
import type { ClientOptions } from "./client-options"

const isCreateSocketValid = (createSocket: (path: string) => WebSocket) =>
  typeof createSocket !== "undefined" && createSocket !== null
const isHostValid = (host: string): boolean => typeof host === "string" && host && host !== ""
const isPortValid = (port: number): boolean =>
  typeof port === "number" && port >= 1 && port <= 65535
const onCommandValid = (fn: (cmd: string) => any) => typeof fn === "function"

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
const validate = (options: ClientOptions) => {
  const { createSocket, host, port, onCommand } = options

  if (!isCreateSocketValid(createSocket)) {
    throw new Error("invalid createSocket function")
  }

  if (!isHostValid(host)) {
    throw new Error("invalid host")
  }

  if (!isPortValid(port)) {
    throw new Error("invalid port")
  }

  if (!onCommandValid(onCommand)) {
    throw new Error("invalid onCommand handler")
  }
}

export default validate
