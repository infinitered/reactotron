import { createServer as createHttpServer, type Server as HttpServer } from "http"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"

import { registerResources } from "./resources"
import { registerTools } from "./tools"

import { appendFileSync } from "fs"

const LOG_FILE = "/tmp/reactotron-mcp.log"
const log = (...args: any[]) => {
  const msg = `[${new Date().toISOString()}] ${args.map(a => typeof a === "string" ? a : JSON.stringify(a)).join(" ")}\n`
  try { appendFileSync(LOG_FILE, msg) } catch {}
  console.log("[reactotron-mcp]", ...args)
}
const logError = (...args: any[]) => {
  const msg = `[${new Date().toISOString()}] ERROR: ${args.map(a => typeof a === "string" ? a : (a?.stack || JSON.stringify(a))).join(" ")}\n`
  try { appendFileSync(LOG_FILE, msg) } catch {}
  console.error("[reactotron-mcp]", ...args)
}

export interface ReactotronMcpServer {
  start(port?: number): void
  stop(): void
  readonly started: boolean
  readonly port: number | null
}

export interface ReactotronMcpOptions {
  /** Called when MCP requests clearing the desktop app's timeline */
  onClearTimeline?: () => void
}

export function createMcpServer(reactotronServer: ReactotronServer, options?: ReactotronMcpOptions): ReactotronMcpServer {
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

      // Catch uncaught errors in the process
      process.on("uncaughtException", (err) => {
        logError("uncaughtException:", err)
      })
      process.on("unhandledRejection", (err) => {
        logError("unhandledRejection:", err)
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

        if (url.pathname === "/mcp" && req.method === "POST") {
          log("incoming request")
          // Stateless: new server + transport per request
          const mcp = createMcp()
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          })

          try {
            await mcp.connect(transport)
            await transport.handleRequest(req, res)
            log("request handled successfully")

            res.on("close", () => {
              log("response closed, cleaning up")
              transport.close()
              mcp.close()
            })
          } catch (err) {
            logError("request handler error:", err)
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json" })
              res.end(JSON.stringify({
                jsonrpc: "2.0",
                error: { code: -32603, message: String(err) },
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

      httpServer.on("error", (err) => {
        logError("HTTP server error:", err)
      })

      httpServer.listen(port, () => {
        started = true
        listenPort = port
        log(`started on port ${port}`)
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
      log("stopped")
    },
  }
}
