import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"
import { z } from "zod"

function resolveClientId(
  server: ReactotronServer,
  requestedClientId?: string
): { clientId?: string; error?: string } {
  const connections = server.connections as any[]

  if (connections.length === 0) {
    return { error: "No apps connected to Reactotron." }
  }

  if (connections.length > 1 && !requestedClientId) {
    const apps = connections.map((c) => `${c.name} (${c.platform}): ${c.clientId}`).join(", ")
    return { error: `Multiple apps connected. Specify clientId. Available: ${apps}` }
  }

  return { clientId: requestedClientId || connections[0]?.clientId }
}

export function registerTools(
  mcp: McpServer,
  server: ReactotronServer,
  commandBuffer: Command[]
) {
  mcp.registerTool("dispatch_action", {
    description: "Dispatch a Redux action to the connected app. Requires the Reactotron Redux plugin.",
    inputSchema: {
      type: z.object({
        type: z.string().describe("Action type, e.g. 'INCREMENT'"),
        payload: z.any().optional().describe("Optional action payload"),
      }),
      clientId: z.string().optional().describe("Target app (required when multiple apps connected)"),
    },
  }, async (args) => {
    const { clientId, error } = resolveClientId(server, args.clientId)
    if (error) return { content: [{ type: "text", text: JSON.stringify({ status: "error", message: error }) }] }

    server.send("state.action.dispatch", { action: { type: args.type, payload: args.payload } }, clientId)
    return { content: [{ type: "text", text: JSON.stringify({ status: "dispatched", action: { type: args.type, payload: args.payload } }) }] }
  })

  mcp.registerTool("request_state", {
    description: "Request a fresh state snapshot from the connected app. Waits up to 3s for the response.",
    inputSchema: {
      path: z.string().optional().describe("State path to request (default: root)"),
      clientId: z.string().optional().describe("Target app (required when multiple apps connected)"),
    },
  }, async (args) => {
    const { clientId, error } = resolveClientId(server, args.clientId)
    if (error) return { content: [{ type: "text", text: JSON.stringify({ status: "error", message: error }) }] }

    const path = args.path ?? ""
    server.send("state.values.request", { path }, clientId)

    const start = Date.now()
    const startLen = commandBuffer.length
    while (Date.now() - start < 3000) {
      await new Promise((r) => setTimeout(r, 200))
      for (let i = startLen; i < commandBuffer.length; i++) {
        if (commandBuffer[i].type === "state.values.response") {
          return { content: [{ type: "text", text: JSON.stringify({ status: "success", state: commandBuffer[i].payload?.value ?? commandBuffer[i].payload }) }] }
        }
      }
    }
    return { content: [{ type: "text", text: JSON.stringify({ status: "timeout", message: "No state response within 3 seconds." }) }] }
  })

  mcp.registerTool("swap_state", {
    description: "Replace the entire app state tree. WARNING: no undo. Requires the Reactotron state plugin.",
    inputSchema: {
      state: z.record(z.any()).describe("The complete replacement state tree"),
      clientId: z.string().optional().describe("Target app (required when multiple apps connected)"),
    },
  }, async (args) => {
    const { clientId, error } = resolveClientId(server, args.clientId)
    if (error) return { content: [{ type: "text", text: JSON.stringify({ status: "error", message: error }) }] }

    server.send("state.restore.request", { state: args.state }, clientId)
    return { content: [{ type: "text", text: JSON.stringify({ status: "swapped", message: "State replacement sent to app." }) }] }
  })

  mcp.registerTool("send_custom_command", {
    description: "Send a named custom command to the app. The app must have a registered handler for this command.",
    inputSchema: {
      command: z.string().describe("The custom command name"),
      args: z.any().optional().describe("Optional arguments"),
      clientId: z.string().optional().describe("Target app (required when multiple apps connected)"),
    },
  }, async (args) => {
    const { clientId, error } = resolveClientId(server, args.clientId)
    if (error) return { content: [{ type: "text", text: JSON.stringify({ status: "error", message: error }) }] }

    server.send("custom", { command: args.command, args: args.args }, clientId)
    return { content: [{ type: "text", text: JSON.stringify({ status: "sent", command: args.command }) }] }
  })
}
