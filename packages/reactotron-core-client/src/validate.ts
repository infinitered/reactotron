import { allPass, complement, isNil, is, isEmpty } from 'ramda'
import * as WebSocket from 'ws'
import { ClientOptions } from './client-options'

const isCreateSocketValid = (createSocket: (path: string) => WebSocket) => !isNil(createSocket)
const isHostValid = allPass([is(String), complement(isEmpty)])
const isPortValid = allPass([complement(isNil), is(Number), (n: number) => n >= 1 && n <= 65535])
const onCommandValid = (fn: (cmd: string) => any) => typeof fn === 'function'

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
const validate = (options: ClientOptions) => {
  const { createSocket, host, port, onCommand } = options

  if (!isCreateSocketValid(createSocket)) {
    throw new Error('invalid createSocket function')
  }

  if (!isHostValid(host)) {
    throw new Error('invalid host')
  }

  if (!isPortValid(port)) {
    throw new Error('invalid port')
  }

  if (!onCommandValid(onCommand)) {
    throw new Error('invalid onCommand handler')
  }
}

export default validate
