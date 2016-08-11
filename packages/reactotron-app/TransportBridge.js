/**
 * Brokers communication between the electron renderer and the reactotron server.
 */
import { ipcMain } from 'electron'
import { createServer, createDefaultTransport } from 'reactotron-core-server'

export default webContents => {
  let server
  ipcMain.on('reactotron.create', (event, port) => {
    const realTransport = createDefaultTransport({
      port,

      // fires when someone connects
      onConnect: opts =>
        webContents.send('reactotron.connect', opts),

      // received from the server when someone disconnects
      onDisconnect: id =>
        webContents.send('reactotron.disconnect', id),

      // received from the server
      onCommand: (command, commandPayload) =>
        webContents.send('reactotron.command', command, commandPayload)
    })

    // fires when the renderer wants to send a command
    ipcMain.on('reactotron.send', (event, command, commandPayload) => {
      realTransport.send(command, commandPayload)
    })

    // fires when the renderer wants to stop
    ipcMain.on('reactotron.stop', () => realTransport.stop())

    // fires when the renderer wants to close
    ipcMain.on('reactotron.close', () => realTransport.close())

    // create the server
    server = createServer({ port }, realTransport)
  })

  webContents.send('reactotron.initialized', 'hey')

  return server
}
