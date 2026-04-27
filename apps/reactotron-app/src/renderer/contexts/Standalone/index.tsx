import React, { useRef, useEffect, useCallback, useState, useMemo } from "react"
import Server, { createServer } from "reactotron-core-server"
import { createMcpServer, type ReactotronMcpServer, type McpRedactionServerConfig } from "reactotron-mcp"
import type { McpRedactionConfig } from "reactotron-core-contract"

import ReactotronBrain from "../../ReactotronBrain"
import config from "../../config"

import useStandalone, { Connection, ServerStatus } from "./useStandalone"

export type McpStatus = "stopped" | "started" | "error"

function readRedactionConfig(): McpRedactionServerConfig {
  return {
    defaults: {
      headerNames: config.get("mcpRedactionHeaderNames") as string[],
      sensitiveKeys: config.get("mcpRedactionSensitiveKeys") as string[],
      statePathPatterns: config.get("mcpRedactionStatePathPatterns") as string[],
      valuePatterns: config.get("mcpRedactionValuePatterns") as string[],
    },
    allowClientDisable: config.get("mcpAllowClientDisable") as boolean,
    allowClientRemoveRules: config.get("mcpAllowClientRemoveRules") as boolean,
  }
}

// TODO: Move up to better places like core somewhere!
interface Context {
  serverStatus: ServerStatus
  connections: Connection[]
  selectedConnection: Connection
  selectConnection: (clientId: string) => void
  mcpStatus: McpStatus
  mcpPort: number | null
  toggleMcp: () => void
  mcpRedactionEnforced: boolean
  openMcpSettings: () => void
  closeMcpSettings: () => void
  mcpSettingsOpen: boolean
  updateMcpRedactionConfig: (cfg: Partial<McpRedactionServerConfig>) => void
  mcpRedactionConfig: McpRedactionServerConfig
}

const StandaloneContext = React.createContext<Context>({
  serverStatus: "stopped",
  connections: [],
  selectedConnection: null,
  selectConnection: null,
  mcpStatus: "stopped",
  mcpPort: null,
  toggleMcp: () => {},
  mcpRedactionEnforced: true,
  openMcpSettings: () => {},
  closeMcpSettings: () => {},
  mcpSettingsOpen: false,
  updateMcpRedactionConfig: () => {},
  mcpRedactionConfig: readRedactionConfig(),
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
  const [mcpSettingsOpen, setMcpSettingsOpen] = useState(false)
  const [mcpRedactionConfig, setMcpRedactionConfig] = useState<McpRedactionServerConfig>(readRedactionConfig)

  // "Enforced" = no connected client has actually weakened redaction. Granting
  // the permission alone (allowClientDisable / allowClientRemoveRules) doesn't
  // flip this — only an actual client opt-out that the server is honoring does.
  const mcpRedactionEnforced = useMemo(() => {
    const { allowClientDisable, allowClientRemoveRules } = mcpRedactionConfig
    if (!allowClientDisable && !allowClientRemoveRules) return true
    return !connections.some((c) => {
      const cfg = (c as unknown as { mcpRedaction?: McpRedactionConfig }).mcpRedaction
      if (!cfg) return false
      if (allowClientDisable && cfg.disableRedaction) return true
      if (allowClientRemoveRules && cfg.removeRules) return true
      return false
    })
  }, [connections, mcpRedactionConfig.allowClientDisable, mcpRedactionConfig.allowClientRemoveRules])

  const openMcpSettings = useCallback(() => setMcpSettingsOpen(true), [])
  const closeMcpSettings = useCallback(() => setMcpSettingsOpen(false), [])

  const updateMcpRedactionConfig = useCallback((cfg: Partial<McpRedactionServerConfig>) => {
    setMcpRedactionConfig((prev) => {
      const next: McpRedactionServerConfig = {
        ...prev,
        ...cfg,
        defaults: cfg.defaults ? { ...prev.defaults, ...cfg.defaults } : prev.defaults,
      }
      // Persist to electron-store
      config.set("mcpRedactionHeaderNames", next.defaults.headerNames ?? [])
      config.set("mcpRedactionSensitiveKeys", next.defaults.sensitiveKeys ?? [])
      config.set("mcpRedactionStatePathPatterns", next.defaults.statePathPatterns ?? [])
      config.set("mcpRedactionValuePatterns", next.defaults.valuePatterns ?? [])
      config.set("mcpAllowClientDisable", next.allowClientDisable)
      config.set("mcpAllowClientRemoveRules", next.allowClientRemoveRules)
      // Update running MCP server if active
      if (mcpServerRef.current) {
        mcpServerRef.current.updateRedactionConfig(next)
      }
      return next
    })
  }, [])

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
      const mcp = createMcpServer(reactotronServer.current, mcpRedactionConfig)
      mcp.start(port).then(() => {
        mcpServerRef.current = mcp
        setMcpStatus("started")
        setMcpPort(port)
      }).catch(() => {
        setMcpStatus("error")
        setMcpPort(null)
      })
    }
  }, [mcpStatus, mcpRedactionConfig])

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
        mcpRedactionEnforced,
        openMcpSettings,
        closeMcpSettings,
        mcpSettingsOpen,
        updateMcpRedactionConfig,
        mcpRedactionConfig,
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
