
const isHostValid = (host: string): boolean => typeof host === 'string' && host && host !== ''
const isPortValid = (port: number): boolean => typeof port === 'number' && port >= 1 && port <= 65535

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
