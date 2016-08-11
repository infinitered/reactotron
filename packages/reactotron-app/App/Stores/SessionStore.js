import UiStore from './UiStore'
import { ipcRenderer } from 'electron'
import { createServer } from 'reactotron-core-server'

class Session {

  ui
  bridgeTransport
  server

  constructor (port = 9090) {
    // create the ui store
    this.ui = new UiStore(this.server)

    // configure the bridge transport
    this.bridgeTransport = {
      stop: () => ipcRenderer.send('reactotron.stop'),
      send: (command, commandPayload) => ipcRenderer.send('reactotron.send', command, commandPayload),
      close: () => ipcRenderer.send('reactotron.close')
    }

    // javascript a few functions ... :(
    let realConnect
    let realDisconnect
    let realCommand

    // our own core-server transport
    const createTransport = () => ({ port, onConnect, onDisconnect, onCommand }) => {
      // where we grab a ref to the functions we'll callback
      realConnect = onConnect
      realDisconnect = onDisconnect
      realCommand = onCommand

      // but return the configured bridge
      return this.bridgeTransport
    }

    // when the main process tells us it's ready
    ipcRenderer.on('reactotron.initialized', () => {
      // listen for connect messages from the main process & pipe them into our transport
      ipcRenderer.on('reactotron.connect', (event, { id, address }) => {
        realConnect && realConnect({ id, address })
      })
      // same for disconnect
      ipcRenderer.on('reactotron.disconnect', (event, id) => {
        realDisconnect && realDisconnect(id)
      })
      // and command
      ipcRenderer.on('reactotron.command', (event, command, commandPayload) => {
        realCommand && realCommand(command, commandPayload)
      })

      // let's tell the main process it should create the connection
      ipcRenderer.send('reactotron.create', port)
    })

    // let's create our faux server & start it up
    this.server = createServer({ port }, createTransport())
    this.server.start()
  }
}

export default Session
