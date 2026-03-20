import { createServer as createHttpServer, type Server as HttpServer } from "http"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"

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

  /** Create a fresh McpServer instance with all resources/tools registered */
  function createMcp(): McpServer {
    const mcp = new McpServer(
      { name: "reactotron", version: "0.1.0" },
      { capabilities: { resources: {}, tools: {} } }
    )
    registerResources(mcp, reactotronServer, commandBuffer)
    registerTools(mcp, reactotronServer, commandBuffer)
    return mcp
  }

  return {
    get started() { return started },
    get port() { return listenPort },

    start(port = 4567) {
      if (started) return

      startBuffering()

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

        if (url.pathname === "/mcp" && req.method === "POST") {
          // Stateless: new server + transport per request
          const mcp = createMcp()
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          })

          try {
            await mcp.connect(transport)
            await transport.handleRequest(req, res)

            res.on("close", () => {
              transport.close()
              mcp.close()
            })
          } catch (err) {
            console.error("[reactotron-mcp] error:", err)
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json" })
              res.end(JSON.stringify({
                jsonrpc: "2.0",
                error: { code: -32603, message: "Internal server error" },
                id: null,
              }))
            }
          }
        } else if (url.pathname === "/mcp") {
          res.writeHead(405, { "Content-Type": "application/json" })
          res.end(JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Method not allowed." },
            id: null,
          }))
        } else {
          res.writeHead(404)
          res.end("Not found")
        }
      })

      httpServer.listen(port, () => {
        started = true
        listenPort = port
      })
    },

    stop() {
      if (!started) return

      stopBuffering()

      if (httpServer) {
        httpServer.close()
        httpServer = null
      }

      started = false
      listenPort = null
    },
  }
}
