import { createClient } from "reactotron-core-client"
export trackGlobalErrors from "./plugins/track-global-errors"

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

var DEFAULTS = {
  createSocket: path => new WebSocket(path), // eslint-disable-line
  host: "localhost",
  port: 9090,
  name: "React JS App",
  userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
  client: {
    name: "reactotron-react-js",
    version: "REACTOTRON_REACT_JS_VERSION",
  },
}

// -----------
// HERE WE GO!
// -----------
// Create the default reactotron.
export default createClient(DEFAULTS)
