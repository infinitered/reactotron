import { createServer as createHttpServer, type Server as HttpServer } from "http"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"
import { z } from "zod"

import { registerResources } from "./resources"
import { registerTools } from "./tools"

export interface ReactotronMcpServer {
  start(port?: number): void
  stop(): void
  readonly started: boolean
  readonly port: number | null
}

export function createMcpServer(reactotronServer: ReactotronServer): ReactotronMcpServer {
  let httpServer: HttpServer | null = null
  let transport: StreamableHTTPServerTransport | null = null
  let mcp: McpServer | null = null
  let started = false
  let listenPort: number | null = null

  // Command buffer — collects recent commands for resource reads
  const commandBuffer: Command[] = []
  const BUFFER_SIZE = 500
  let commandListener: ((command: Command) => void) | null = null

  function startBuffering() {
    commandListener = (command: Command) => {
      commandBuffer.push(command)
      if (commandBuffer.length > BUFFER_SIZE) {
        commandBuffer.shift()
      }
    }
    reactotronServer.on("command", commandListener as any)
  }

  function stopBuffering() {
    if (commandListener) {
      reactotronServer.off("command", commandListener as any)
      commandListener = null
    }
    commandBuffer.length = 0
  }

  return {
    get started() { return started },
    get port() { return listenPort },

    start(port = 4567) {
      if (started) return

      startBuffering()

      mcp = new McpServer(
        { name: "reactotron", version: "0.1.0" },
        { capabilities: { resources: {}, tools: {} } }
      )

      registerResources(mcp, reactotronServer, commandBuffer)
      registerTools(mcp, reactotronServer, commandBuffer)

      // HTTP transport
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
      })

      httpServer = createHttpServer(async (req, res) => {
        // CORS
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id")

        if (req.method === "OPTIONS") {
          res.writeHead(204)
          res.end()
          return
        }

        const url = new URL(req.url ?? "/", `http://${req.headers.host}`)
        if (url.pathname === "/mcp") {
          await transport!.handleRequest(req, res)
        } else {
          res.writeHead(404)
          res.end("Not found")
        }
      })

      mcp.connect(transport)

      httpServer.listen(port, () => {
        started = true
        listenPort = port
      })
    },

    stop() {
      if (!started) return

      stopBuffering()

      if (transport) {
        transport.close()
        transport = null
      }
      if (mcp) {
        mcp.close()
        mcp = null
      }
      if (httpServer) {
        httpServer.close()
        httpServer = null
      }

      started = false
      listenPort = null
    },
  }
}
