// Modified version of rn-host-detect to fix react-native 0.56.0+. Original: https://github.com/jhen0409/rn-host-detect
'use strict'
var NativeModules = require('react-native').NativeModules

/*
 * It only for Debug Remotely mode for Android
 * When __DEV__ === false, we can't use window.require('NativeModules')
 */
function getByRemoteConfig(hostname) {
  var remoteModuleConfig = typeof window !== 'undefined' &&
    window.__fbBatchedBridgeConfig &&
    window.__fbBatchedBridgeConfig.remoteModuleConfig
  if (
    !Array.isArray(remoteModuleConfig) ||
    hostname !== 'localhost' && hostname !== '127.0.0.1'
  ) return hostname

  var constants = (
    remoteModuleConfig.find(getConstants) || []
  )[1]
  if (constants) {
    var serverHost = constants.ServerHost || hostname
    return serverHost.split(':')[0]
  }
  return hostname
}

function getConstants(config) {
  return config && (config[0] === 'AndroidConstants' || config[0] === 'PlatformConstants')
}

/*
 * Get React Native server IP if hostname is `localhost`
 * On Android emulator, the IP of host is `10.0.2.2` (Genymotion: 10.0.3.2)
 */
export default (hostname) => {
  if (
    typeof __fbBatchedBridge !== 'object' ||  // Not on react-native
    hostname !== 'localhost' && hostname !== '127.0.0.1'
  ) {
    return hostname
  }
  hostname = getByRemoteConfig(hostname)
  var originalWarn = console.warn
  console.warn = function() {
    if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].indexOf('Requiring module \'NativeModules\' by name') > -1) return
    return originalWarn.apply(console, arguments)
  }

  var NativeModules
  var PlatformConstants
  var AndroidConstants
  if (typeof window === 'undefined' || !window.__DEV__ || typeof window.require !== 'function') {
    return hostname
  }
  console.warn = originalWarn
  if (
    !NativeModules ||
    (!NativeModules.PlatformConstants && !NativeModules.AndroidConstants)
  ) {
    return hostname
  }
  PlatformConstants = NativeModules.PlatformConstants
  AndroidConstants = NativeModules.AndroidConstants

  var serverHost = (PlatformConstants ?
    PlatformConstants.ServerHost :
    AndroidConstants.ServerHost
  ) || hostname
  return serverHost.split(':')[0]
}
