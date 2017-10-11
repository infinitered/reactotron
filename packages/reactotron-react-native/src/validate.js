import R from 'ramda'
import RS from 'ramdasauce'

const isHostValid = R.allPass([R.complement(RS.isNilOrEmpty), R.is(String)])
const isPortValid = R.allPass([R.complement(R.isNil), R.is(Number), RS.isWithin(1, 65535)])

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
const validate = options => {
  const { host, port } = options

  if (!isHostValid(host)) throw new Error('invalid host')
  if (!isPortValid(port)) throw new Error('invalid port')
}

export default validate
