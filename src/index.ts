import { createClient } from "reactotron-core-client"
import trackGlobalErrors from "./plugins/track-global-errors"

export { trackGlobalErrors }

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

const REACTOTRON_ASYNC_CLIENT_ID = '@REACTOTRON/clientId'

/**
 * Safely get some information out the the window.navigator.
 *
 * @param {string} name The property to get.
 */
function getNavigatorProperty(name) {
  if (!name) return undefined
  if (!window) return undefined
  if (!window.navigator && typeof window.navigator !== "object") return undefined
  return window.navigator[name]
}

var DEFAULTS = {
  createSocket: path => new WebSocket(path), // eslint-disable-line
  host: "localhost",
  port: 9090,
  name: "React JS App",
  client: {
    reactotronLibraryName: "reactotron-react-js",
    reactotronLibraryVersion: 'REACTOTRON_REACT_JS_VERSION',
    platform: "browser",
    platformVersion: getNavigatorProperty("platform"),
    userAgent: getNavigatorProperty("userAgent"),
    screenWidth: (screen && screen.width) || undefined,
    screenHeight: (screen && screen.height) || undefined,
    screenScale: (window && window.devicePixelRatio) || 1,
    windowWidth: (window && window.innerWidth) || undefined,
    windowHeight: (window && window.innerHeight) || undefined
  },
  getClientId: () => {
    return Promise.resolve(localStorage.getItem(REACTOTRON_ASYNC_CLIENT_ID))
  },
  setClientId: clientId => {
    localStorage.setItem(REACTOTRON_ASYNC_CLIENT_ID, clientId)
  }
}

// -----------
// HERE WE GO!
// -----------
// Create the default reactotron.
export default createClient(DEFAULTS as any) // TODO: One day fix typescript
