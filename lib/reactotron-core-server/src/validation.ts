import { allPass, complement, isNil, is } from "ramda"
import { ServerOptions } from "./types"

/**
 * Is this a valid port?
 *
 * @param number The port number.
 */
const isPortValid = allPass([complement(isNil), is(Number), (n) => n >= 1 && n <= 65535])

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 *
 * @param options Additional options to configure the server.
 */
export default (options?: ServerOptions): void => {
  const { port } = options

  if (!isPortValid(port)) {
    throw new Error("invalid port")
  }
}
