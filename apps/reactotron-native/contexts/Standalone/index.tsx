import React from "react"
// import Server, { createServer } from "reactotron-core-server"

import { ReactotronBrain } from "../ReactotronBrain"

import useStandalone, { Connection } from "./useStandalone"

// TODO: Move up to better places like core somewhere!
interface Context {
  connections: Connection[]
  selectedConnection?: Connection | null
  selectConnection: (clientId: string) => void
}

const StandaloneContext = React.createContext<Context>({
  connections: [],
  selectedConnection: null,
  selectConnection: () => {},
})

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const reactotronServer = useRef<Server>(null)

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

  // useEffect(() => {
  //   reactotronServer.current = createServer({ port: config.get("serverPort") as number })

  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore need to sync these types between reactotron-core-server and reactotron-app
  //   reactotronServer.current.on("connectionEstablished", connectionEstablished)
  //   reactotronServer.current.on("command", commandReceived)
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore need to sync these types between reactotron-core-server and reactotron-app
  //   reactotronServer.current.on("disconnect", connectionDisconnected)

  //   reactotronServer.current.start()

  //   return () => {
  //     reactotronServer.current.stop()
  //   }
  // }, [connectionEstablished, commandReceived, connectionDisconnected])

  // const sendCommand = useCallback(
  //   (type: string, payload: any, clientId?: string) => {
  //     // TODO: Do better then just throwing these away...
  //     if (!reactotronServer.current) return

  //     reactotronServer.current.send(type, payload, clientId || selectedClientId)
  //   },
  //   [reactotronServer, selectedClientId]
  // )

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
        // sendCommand={sendCommand}
        sendCommand={() => {}}
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
