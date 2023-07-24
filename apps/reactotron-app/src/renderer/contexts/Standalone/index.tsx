import React, { useRef, useEffect, useCallback, PropsWithChildren } from "react"
import Server, { createServer } from "reactotron-core-server"

import ReactotronBrain from "../../ReactotronBrain"
import config from "../../config"

import useStandalone, { Connection } from "./useStandalone"

// TODO: Move up to better places like core somewhere!
interface Context {
  connections: Connection[]
  selectedConnection: Connection
  selectConnection: (clientId: string) => void
}

const StandaloneContext = React.createContext<Context>({
  connections: [],
  selectedConnection: null,
  selectConnection: null,
})

interface Props {}

const Provider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
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
  } = useStandalone()

  useEffect(() => {
    reactotronServer.current = createServer({ port: config.get("serverPort") as number })

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
