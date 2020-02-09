import React, { FunctionComponent, useRef, useEffect, useCallback } from "react"
import Server, { createServer } from "reactotron-core-server"

import ReactotronBrain from "../../ReactotronBrain"
import config from "../../config"

import useStandalone, { Connection } from "./useStandalone"

// TODO: Move up to better places like core somewhere!
interface Context {
  connections: Connection[]
  selectedConnection: Connection
  selectConnection: (clientId: string) => void
  isSideBarOpen: boolean
  toggleSideBar: () => void
}

const StandaloneContext = React.createContext<Context>({
  connections: [],
  selectedConnection: null,
  selectConnection: null,
  isSideBarOpen: true,
  toggleSideBar: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const reactotronServer = useRef<Server>(null)

  const {
    connections,
    selectedClientId,
    selectedConnection,
    selectConnection,
    clearSelectedConnectionCommands,
    connectionEstablished,
    commandReceived,
    connectionDisconnected,
    addCommandListener,
    isSideBarOpen,
    toggleSideBar,
  } = useStandalone()

  useEffect(() => {
    reactotronServer.current = createServer({ port: config.get("server.port") })

    reactotronServer.current.on("connectionEstablished", connectionEstablished)
    reactotronServer.current.on("command", commandReceived)
    reactotronServer.current.on("disconnect", connectionDisconnected)

    reactotronServer.current.start()

    return () => {
      reactotronServer.current.stop()
    }
  }, [connectionEstablished, commandReceived, connectionDisconnected])

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
        isSideBarOpen,
        toggleSideBar,
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
