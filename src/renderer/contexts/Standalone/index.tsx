import React, { FunctionComponent, useRef, useEffect, useCallback } from "react"
import Server, { createServer } from "reactotron-core-server"

import ReactotronBrain from "../../ReactotronBrain"
import config from "../../config"

import useStandalone from "./useStandalone"
import { Connection } from "./manager"

// TODO: Move up to better places like core somewhere!
interface Context {
  connections: Connection[]
  selectedConnection: Connection
  clearSelectedConnectionCommands: () => void
  selectConnection: (clientId: string) => void
  isSideBarOpen: boolean
  toggleSideBar: () => void
}

const StandaloneContext = React.createContext<Context>({
  connections: [],
  selectedConnection: null,
  clearSelectedConnectionCommands: null,
  selectConnection: null,
  isSideBarOpen: true,
  toggleSideBar: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  // TODO: Allow for setting up the port!
  const reactotronServer = useRef<Server>(null)

  const {
    connections,
    selectedClientId,
    selectedConnection,
    selectConnection,
    clearSelectedConnectionCommands,
    handleConnectionEstablished,
    handleCommand,
    handleDisconnect,
    addCommandListener,
    isSideBarOpen,
    toggleSideBar,
  } = useStandalone()

  useEffect(() => {
    reactotronServer.current = createServer({ port: config.get("server.port") })

    reactotronServer.current.on("connectionEstablished", handleConnectionEstablished)
    reactotronServer.current.on("command", handleCommand)
    reactotronServer.current.on("disconnect", handleDisconnect)

    reactotronServer.current.start()

    return () => {
      reactotronServer.current.stop()
    }
  }, [handleConnectionEstablished, handleCommand, handleDisconnect])

  const sendCommand = useCallback(
    (type: string, payload: any, clientId?: string) => {
      // TODO: Do better then just throwing these away...
      if (!reactotronServer.current) return

      reactotronServer.current.send(type, payload, clientId || selectedClientId)
    },
    [reactotronServer, selectedClientId]
  )

  return (
    <StandaloneContext.Provider
      value={{
        connections,
        selectedConnection,
        selectConnection,
        clearSelectedConnectionCommands,
        isSideBarOpen,
        toggleSideBar,
      }}
    >
      <ReactotronBrain
        commands={(selectedConnection || { commands: [] }).commands}
        sendCommand={sendCommand}
        addCommandListener={addCommandListener}
      >
        {children}
      </ReactotronBrain>
    </StandaloneContext.Provider>
  )
}

export default StandaloneContext
export const StandaloneProvider = Provider
