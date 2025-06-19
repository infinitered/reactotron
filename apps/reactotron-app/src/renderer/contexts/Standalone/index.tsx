import React, { useRef, useEffect, useCallback } from "react"
import { listen } from '@tauri-apps/api/event'

import ReactotronBrain from "../../ReactotronBrain"

import useStandalone, { type Connection, type ServerStatus } from "./useStandalone"
import { invoke } from "@tauri-apps/api/core"
import repairSerialization from "../../util/repair-serialization"

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
    const unlistenStart = listen('start', (event) => {
      console.log('start', repairSerialization(event.payload))
      reactotronIsServerStarted.current = true
      serverStarted()
    })
    const unlistenStop = listen('stop', (event) => {
      console.log('stop', repairSerialization(event.payload))
      reactotronIsServerStarted.current = false
      serverStopped()
    })

    const unlistenConnectionEstablished = listen('connectionEstablished', (event) => {
      console.log('connectionEstablished', repairSerialization(event.payload.payload))
      connectionEstablished(repairSerialization(event.payload.payload))
    })

    const unlistenDisconnect = listen('disconnect', (event) => {
      console.log('disconnect', repairSerialization(event.payload))
      connectionDisconnected(repairSerialization(event.payload))
    })

    const unlistenPortUnavailable = listen('portUnavailable', (event) => {
      console.log('portUnavailable', repairSerialization(event.payload))
      portUnavailable()
    })

    const unlistenCommnad = listen('command', (event) => {
      console.log('command', repairSerialization(event.payload))
      commandReceived(repairSerialization(event.payload))

    })

    invoke('start_core_server')
    
    return () => {
      unlistenStart?.then((unlisten) => unlisten())
      unlistenStop?.then((unlisten) => unlisten())
      unlistenConnectionEstablished?.then((unlisten) => unlisten())
      unlistenCommnad?.then((unlisten) => unlisten())
      unlistenDisconnect?.then((unlisten) => unlisten())
      unlistenPortUnavailable?.then((unlisten) => unlisten())
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

      invoke('send_command', { type, payload, clientId: clientId || selectedClientId })
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
