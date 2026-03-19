import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"

export function getTools() {
  return [
    {
      name: "dispatch_action",
      description: "Dispatch a Redux action to the connected app. Requires the Reactotron Redux plugin.",
      inputSchema: {
        type: "object" as const,
        properties: {
          action: {
            type: "object",
            description: "The Redux action to dispatch",
            properties: {
              type: { type: "string", description: "Action type, e.g. 'INCREMENT'" },
              payload: { description: "Optional action payload" },
            },
            required: ["type"],
          },
          clientId: {
            type: "string",
            description: "Target app (required when multiple apps connected). See the apps resource.",
          },
        },
        required: ["action"],
      },
    },
    {
      name: "request_state",
      description: "Request a fresh state snapshot from the connected app. Waits up to 3s for the response.",
      inputSchema: {
        type: "object" as const,
        properties: {
          path: { type: "string", description: "State path to request (default: root)" },
          clientId: { type: "string", description: "Target app (required when multiple apps connected)." },
        },
      },
    },
    {
      name: "swap_state",
      description: "Replace the entire app state tree. WARNING: no undo. Requires the Reactotron state plugin.",
      inputSchema: {
        type: "object" as const,
        properties: {
          state: { type: "object", description: "The complete replacement state tree" },
          clientId: { type: "string", description: "Target app (required when multiple apps connected)." },
        },
        required: ["state"],
      },
    },
    {
      name: "send_custom_command",
      description: "Send a named custom command to the app. The app must have a registered handler for this command.",
      inputSchema: {
        type: "object" as const,
        properties: {
          command: { type: "string", description: "The custom command name" },
          args: { description: "Optional arguments" },
          clientId: { type: "string", description: "Target app (required when multiple apps connected)." },
        },
        required: ["command"],
      },
    },
  ]
}

function resolveClientId(
  server: ReactotronServer,
  requestedClientId?: string
): { clientId?: string; error?: unknown } {
  const connections = server.connections as any[]

  if (connections.length === 0) {
    return { error: { status: "error", message: "No apps connected to Reactotron." } }
  }

  if (connections.length > 1 && !requestedClientId) {
    return {
      error: {
        status: "error",
        message: "Multiple apps connected. Specify clientId.",
        apps: connections.map((c) => ({ clientId: c.clientId, name: c.name, platform: c.platform })),
      },
    }
  }

  return { clientId: requestedClientId || connections[0]?.clientId }
}

export async function callTool(
  name: string,
  args: Record<string, unknown>,
  server: ReactotronServer,
  commandBuffer: Command[]
): Promise<unknown> {
  switch (name) {
    case "dispatch_action": {
      const { clientId, error } = resolveClientId(server, args.clientId as string)
      if (error) return error

      const action = args.action as { type: string; payload?: unknown }
      if (!action?.type) {
        return { status: "error", message: "action.type is required" }
      }

      server.send("state.action.dispatch", { action }, clientId)
      return { status: "dispatched", action }
    }

    case "request_state": {
      const { clientId, error } = resolveClientId(server, args.clientId as string)
      if (error) return error

      const path = (args.path as string) ?? ""
      server.send("state.values.request", { path }, clientId)

      // Poll for response
      const start = Date.now()
      const startLen = commandBuffer.length
      while (Date.now() - start < 3000) {
        await new Promise((r) => setTimeout(r, 200))
        for (let i = startLen; i < commandBuffer.length; i++) {
          if (commandBuffer[i].type === "state.values.response") {
            return { status: "success", state: commandBuffer[i].payload?.value ?? commandBuffer[i].payload }
          }
        }
      }
      return { status: "timeout", message: "No state response within 3 seconds. The app may not have the state plugin configured." }
    }

    case "swap_state": {
      const { clientId, error } = resolveClientId(server, args.clientId as string)
      if (error) return error

      const state = args.state
      if (!state || typeof state !== "object") {
        return { status: "error", message: "state must be a non-null object" }
      }

      server.send("state.restore.request", { state }, clientId)
      return { status: "swapped", message: "State replacement sent to app." }
    }

    case "send_custom_command": {
      const { clientId, error } = resolveClientId(server, args.clientId as string)
      if (error) return error

      const command = args.command as string
      if (!command) {
        return { status: "error", message: "command name is required" }
      }

      server.send("custom", { command, args: args.args }, clientId)
      return { status: "sent", command }
    }

    default:
      return { status: "error", message: `Unknown tool: ${name}` }
  }
}
