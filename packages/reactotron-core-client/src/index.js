import R from 'ramda'
import validate from './validate'
import logger from './plugins/logger'
import image from './plugins/image'
import benchmark from './plugins/benchmark'
import stateResponses from './plugins/state-responses'
import apiResponse from './plugins/api-response'
import clear from './plugins/clear'
import serialize from './serialize'
import { start } from './stopwatch'

export { start } from './stopwatch'

export const CorePlugins = [
  image(),
  logger(),
  benchmark(),
  stateResponses(),
  apiResponse(),
  clear()
]

const DEFAULTS = {
  io: null, // the socket.io function to create a socket
  host: 'localhost', // the server to connect (required)
  port: 9090, // the port to connect (required)
  name: 'reactotron-core-client', // some human-friendly session name
  secure: false, // use wss instead of ws
  plugins: CorePlugins, // needed to make society function
  safeRecursion: true, // when on, it ensures objects are safe for transport (at the cost of CPU)
  onCommand: cmd => null, // the function called when we receive a command
  onConnect: () => null, // fires when we connect
  onDisconnect: () => null, // fires when we disconnect
  socketIoProperties: {
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  } // socketIO settings
}

// these are not for you.
const isReservedFeature = R.contains(R.__, [
  'options',
  'connected',
  'socket',
  'plugins',
  'configure',
  'connect',
  'send',
  'use',
  'startTimer'
])

export class Client {
  // the configuration options
  options = R.merge({}, DEFAULTS)
  connected = false
  socket = null
  plugins = []

  startTimer = () => start()

  constructor () {
    // we will be invoking send from callbacks other than inside this file
    this.send = this.send.bind(this)
  }

  /**
   * Set the configuration options.
   */
  configure (options = {}) {
    // options get merged & validated before getting set
    const newOptions = R.merge(this.options, options)
    validate(newOptions)
    this.options = newOptions

    // if we have plugins, let's add them here
    if (R.has('length', this.options.plugins)) {
      R.forEach(this.use.bind(this), this.options.plugins)
    }

    return this
  }

  /**
   * Connect to the Reactotron server.
   */
  connect () {
    this.connected = true
    const {
      io,
      secure,
      host,
      port,
      name,
      userAgent,
      environment,
      reactotronVersion,
      socketIoProperties
    } = this.options
    const { onCommand, onConnect, onDisconnect } = this.options

    // establish a socket.io connection to the server
    const protocol = secure ? 'wss' : 'ws'
    const socket = io(`${protocol}://${host}:${port}`, {
      jsonp: false,
      transports: ['websocket', 'polling'],
      ...socketIoProperties
    })

    // fires when we talk to the server
    socket.on('connect', () => {
      // fire our optional onConnect handler
      onConnect && onConnect()

      // trigger our plugins onConnect
      R.forEach(plugin => plugin.onConnect && plugin.onConnect(), this.plugins)

      // introduce ourselves
      this.send('client.intro', { host, port, name, userAgent, reactotronVersion, environment })
    })

    // fires when we disconnect
    socket.on('disconnect', () => {
      // trigger our disconnect handler
      onDisconnect && onDisconnect()

      // as well as the plugin's onDisconnect
      R.forEach(plugin => plugin.onDisconnect && plugin.onDisconnect(), this.plugins)
    })

    // fires when we receive a command, just forward it off
    socket.on('command', command => {
      // trigger our own command handler
      onCommand && onCommand(command)

      // trigger our plugins onCommand
      R.forEach(plugin => plugin.onCommand && plugin.onCommand(command), this.plugins)
    })

    // assign the socket to the instance
    this.socket = socket

    return this
  }

  /**
   * Sends a command to the server
   */
  send (type, payload = {}, important = false) {
    // jet if we don't have a socket
    if (!this.socket) return

    // Do a cycle of serialization -> deserialization to ensure
    // circular deps are weeded out.
    //
    // NOTE(steve): socket.io is going away shortly, so there will
    // be no need to deserialize as we'll be sending text over the
    // wire.
    const actualPayload = this.options.safeRecursion ? JSON.parse(serialize(payload)) : payload

    // send this command
    this.socket.emit('command', {
      type,
      payload: actualPayload,
      important: !!important
    })
  }

  /**
   * Sends a custom command to the server to displays nicely.
   */
  display (config = {}) {
    const { name, value, preview, image, important = false } = config
    const payload = {
      name,
      value: value || null,
      preview: preview || null,
      image: image || null
    }
    this.send('display', payload, important)
  }

  /**
   * Client libraries can hijack this to report errors.
   */
  reportError (error) {
    this.error(error)
  }

  /**
   * Adds a plugin to the system
   */
  use (pluginCreator) {
    // we're supposed to be given a function
    if (typeof pluginCreator !== 'function') throw new Error('plugins must be a function')

    // execute it immediately passing the send function
    const plugin = pluginCreator.bind(this)(this)

    // ensure we get an Object-like creature back
    if (!R.is(Object, plugin)) throw new Error('plugins must return an object')

    // do we have features to mixin?
    if (plugin.features) {
      // validate
      if (!R.is(Object, plugin.features)) throw new Error('features must be an object')

      // here's how we're going to inject these in
      const inject = key => {
        // grab the function
        const featureFunction = plugin.features[key]

        // only functions may pass
        if (typeof featureFunction !== 'function') { throw new Error(`feature ${key} is not a function`) }

        // ditch reserved names
        if (isReservedFeature(key)) throw new Error(`feature ${key} is a reserved name`)

        // ok, let's glue it up... and lose all respect from elite JS champions.
        this[key] = featureFunction
      }

      // let's inject
      R.forEach(inject, R.keys(plugin.features))
    }

    // add it to the list
    this.plugins.push(plugin)

    // call the plugins onPlugin
    plugin.onPlugin && typeof plugin.onPlugin === 'function' && plugin.onPlugin.bind(this)(this)

    // chain-friendly
    return this
  }
}

// convenience factory function
export const createClient = options => {
  const client = new Client()
  client.configure(options)
  return client
}
