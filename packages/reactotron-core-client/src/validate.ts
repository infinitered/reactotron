import R from 'ramda'
import RS from 'ramdasauce'
import WebSocket from 'ws'
import { Options } from './index'

const isCreateSocketValid = (createSocket: (path: string) => WebSocket) => !R.isNil(createSocket)
const isHostValid = R.allPass([R.complement(RS.isNilOrEmpty), R.is(String)])
const isPortValid = R.allPass([R.complement(R.isNil), R.is(Number), RS.isWithin(1, 65535)])
const onCommandValid = (fn: (cmd: string) => any) => typeof fn === 'function'

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
const validate = (options: Options) => {
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
