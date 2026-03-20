import React, { useRef, useEffect, useCallback, useState } from "react"
import Server, { createServer } from "reactotron-core-server"
import { createMcpServer, type ReactotronMcpServer } from "reactotron-mcp"

import ReactotronBrain from "../../ReactotronBrain"
import config from "../../config"

import useStandalone, { Connection, ServerStatus } from "./useStandalone"

export type McpStatus = "stopped" | "started" | "error"

// TODO: Move up to better places like core somewhere!
interface Context {
  serverStatus: ServerStatus
  connections: Connection[]
  selectedConnection: Connection
  selectConnection: (clientId: string) => void
  mcpStatus: McpStatus
  mcpPort: number | null
  toggleMcp: () => void
}

const StandaloneContext = React.createContext<Context>({
  serverStatus: "stopped",
  connections: [],
  selectedConnection: null,
  selectConnection: null,
  mcpStatus: "stopped",
  mcpPort: null,
  toggleMcp: () => {},
})

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reactotronServer = useRef<Server>(null)

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
    reactotronServer.current = createServer({ port: config.get("serverPort") as number })

    reactotronServer.current.on("start", serverStarted)
    reactotronServer.current.on("stop", serverStopped)
    // @ts-expect-error need to sync these types between reactotron-core-server and reactotron-app
    reactotronServer.current.on("connectionEstablished", connectionEstablished)
    reactotronServer.current.on("command", commandReceived)
    // @ts-expect-error need to sync these types between reactotron-core-server and reactotron-app
    reactotronServer.current.on("disconnect", connectionDisconnected)
    reactotronServer.current.on("portUnavailable", portUnavailable)

    reactotronServer.current.start()

    return () => {
      reactotronServer.current.stop()
    }
  }, [
    serverStarted,
    serverStopped,
    connectionEstablished,
    commandReceived,
    connectionDisconnected,
    portUnavailable,
  ])

  const mcpServerRef = useRef<ReactotronMcpServer>(null)
  const [mcpStatus, setMcpStatus] = useState<McpStatus>("stopped")
  const [mcpPort, setMcpPort] = useState<number | null>(null)

  // Clean up MCP server on unmount
  useEffect(() => {
    return () => {
      if (mcpServerRef.current) {
        mcpServerRef.current.stop()
        mcpServerRef.current = null
      }
    }
  }, [])

  const toggleMcp = useCallback(() => {
    if (!reactotronServer.current) return

    if (mcpStatus === "started") {
      if (mcpServerRef.current) {
        mcpServerRef.current.stop()
        mcpServerRef.current = null
      }
      setMcpStatus("stopped")
      setMcpPort(null)
    } else {
      const port = config.get("mcpPort") as number
      const mcp = createMcpServer(reactotronServer.current)
      mcp.start(port).then(() => {
        mcpServerRef.current = mcp
        setMcpStatus("started")
        setMcpPort(port)
      }).catch(() => {
        setMcpStatus("error")
        setMcpPort(null)
      })
    }
  }, [mcpStatus])

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
        serverStatus,
        connections,
        selectedConnection,
        selectConnection,
        mcpStatus,
        mcpPort,
        toggleMcp,
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
