/*
 * Get React Native server IP if hostname is `localhost`
 * On Android emulator, the IP of host is `10.0.2.2` (Genymotion: 10.0.3.2)
 */
const getHost = (defaultHost = 'localhost') => {
  const { remoteModuleConfig } = typeof window !== 'undefined' &&
    window.__fbBatchedBridgeConfig || {}
  if (
    defaultHost !== 'localhost' && defaultHost !== '127.0.0.1' ||
    !Array.isArray(remoteModuleConfig)
  ) return defaultHost

  const [, AndroidConstants] = remoteModuleConfig.find(config =>
    config && config[0] === 'AndroidConstants'
  ) || []
  if (AndroidConstants) {
    const { ServerHost = defaultHost } = AndroidConstants
    return ServerHost.split(':')[0]
  }

  return defaultHost
}

export default getHost
