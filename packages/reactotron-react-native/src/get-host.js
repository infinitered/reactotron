/*
 * Get React Native server IP if hostname is `localhost`
 * On Android emulator, the IP of host is `10.0.2.2` (Genymotion: 10.0.3.2)
 */
const getHost = (defaultHost = 'localhost') => {
  if (
    typeof window !== 'undefined' &&
    window.__fbBatchedBridge &&
    window.__fbBatchedBridge.RemoteModules &&
    window.__fbBatchedBridge.RemoteModules.AndroidConstants
  ) {
    const {
      ServerHost = defaultHost
    } = window.__fbBatchedBridge.RemoteModules.AndroidConstants
    return ServerHost.split(':')[0]
  }

  return defaultHost
}

export default getHost
