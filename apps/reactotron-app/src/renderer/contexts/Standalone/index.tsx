import React, { useRef, useEffect, useCallback } from "react"

import ReactotronBrain from "../../ReactotronBrain"

import useStandalone, { type Connection, type ServerStatus } from "./useStandalone"
import { ipcRenderer } from "../../util/ipc"

// TODO: Move up to better places like core somewhere!
interface Context {
  serverStatus: ServerStatus
  connections: Connection[]
  selectedConnection: Connection
  selectConnection: (clientId: string) => void
}

const StandaloneContext = React.createContext<Context>({
  serverStatus: "stopped",
  connections: [],
  selectedConnection: null,
  selectConnection: null,
})

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reactotronIsServerStarted = useRef<boolean>(false)

  const {
    serverStatus,
    connections,
    selectedClientId,
    selectedConnection,
    selectConnection,
    clearSelectedConnectionCommands,
    serverStarted,
    serverStopped,
    connectionEstablished,
    commandReceived,
    connectionDisconnected,
    addCommandListener,
    portUnavailable,
  } = useStandalone()

  useEffect(() => {
    ipcRenderer.on('start', () => {
      reactotronIsServerStarted.current = true
      serverStarted()
    })
    ipcRenderer.on('stop', () => {
      reactotronIsServerStarted.current = false
      serverStopped()
    })
    ipcRenderer.on('connectionEstablished', (_, args) => {
      connectionEstablished(args)
    })
    ipcRenderer.on('command', (_, args) => {
      commandReceived(args)
    })
    ipcRenderer.on('disconnect', (_, args) => {
      connectionDisconnected(args)
    })
    ipcRenderer.on('portUnavailable', () => {
      portUnavailable()
    })


    ipcRenderer.sendSync('core-server-start');
    
    
    return () => {
      ipcRenderer.removeAllListeners('start')
      ipcRenderer.removeAllListeners('stop')
      ipcRenderer.removeAllListeners('connectionEstablished')
      ipcRenderer.removeAllListeners('command')
      ipcRenderer.removeAllListeners('disconnect')
      ipcRenderer.removeAllListeners('portUnavailable')
      ipcRenderer.sendSync('core-server-stop');
    }
  }, [
    serverStarted,
    serverStopped,
    connectionEstablished,
    commandReceived,
    connectionDisconnected,
    portUnavailable,
  ])

  const sendCommand = useCallback(
    (type: string, payload: any, clientId?: string) => {
      if(!reactotronIsServerStarted.current) return;
      
      ipcRenderer?.send('core-server-send-command', { type, payload, clientId: clientId || selectedClientId })
    },
    [selectedClientId]
  )

  return (
    <StandaloneContext.Provider
      value={{
        serverStatus,
        connections,
        selectedConnection,
        selectConnection,
      }}
    >
      <ReactotronBrain
        commands={(selectedConnection || { commands: [] }).commands}
        sendCommand={sendCommand}
        clearCommands={clearSelectedConnectionCommands}
        addCommandListener={addCommandListener}
      >
        {children}
      </ReactotronBrain>
    </StandaloneContext.Provider>
  )
}

export default StandaloneContext
export const StandaloneProvider = Provider
