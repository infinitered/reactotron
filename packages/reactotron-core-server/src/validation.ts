import R from 'ramda'
import RS from 'ramdasauce'

/**
 * Is this a valid port?
 */
const isPortValid = <(port) => boolean>R.allPass([
  R.complement(R.isNil),
  R.is(Number),
  RS.isWithin(1, 65535)
])

/**
 * Is this a valid command?
 */
const isOnCommandValid = <(onCommand) => boolean>R.allPass([
  R.complement(R.isNil)
])

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
export default (options: { port: number, onCommand: () => any }) => {
  const { port, onCommand } = options

  if (!isPortValid(port)) throw new Error('invalid port')
  if (!isOnCommandValid(onCommand)) throw new Error('onCommand is required')
}
