import React, { FunctionComponent, useRef, useEffect } from "react"
import Server, { createServer } from "reactotron-core-server"

import ReactotronBrain from "../../ReactotronBrain"

import useStandalone from "./useStandalone"
import { Connection } from "./manager"

// TODO: Move up to better places like core somewhere!
interface Context {
  connections: Connection[]
  selectedConnection: Connection
}

const StandaloneContext = React.createContext<Context>({
  connections: [],
  selectedConnection: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  // TODO: Allow for setting up the port!
  const reactotronServer = useRef<Server>(null)

  const {
    connections,
    selectedConnection,
    handleConnectionEstablished,
    handleCommand,
    handleDisconnect,
  } = useStandalone()

  useEffect(() => {
    reactotronServer.current = createServer({ port: 9090 })

    reactotronServer.current.on("connectionEstablished", handleConnectionEstablished)
    reactotronServer.current.on("command", handleCommand)
    reactotronServer.current.on("disconnect", handleDisconnect)

    // resend the storybook state to newly arriving connections
    // reactotronServer.current.on("connectionEstablished", connection =>
    //   this.ui.sendStorybookState(connection.clientId)
    // )

    reactotronServer.current.start()

    return () => {
      reactotronServer.current.stop()
    }
  }, [handleConnectionEstablished, handleCommand, handleDisconnect])

  return (
    <StandaloneContext.Provider value={{ connections, selectedConnection }}>
      <ReactotronBrain commands={(selectedConnection || { commands: [] }).commands}>
        {children}
      </ReactotronBrain>
    </StandaloneContext.Provider>
  )
}

export default StandaloneContext
export const StandaloneProvider = Provider
