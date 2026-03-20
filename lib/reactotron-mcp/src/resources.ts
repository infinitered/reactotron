import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"

interface AppInfo {
  id: number
  clientId: string
  name: string
  platform: string
  platformVersion?: string
}

function getApps(server: ReactotronServer): AppInfo[] {
  return (server.connections as any[]).map((c) => ({
    id: c.id,
    clientId: c.clientId,
    name: c.name,
    platform: c.platform,
    platformVersion: c.platformVersion,
  }))
}

function connectionMeta(server: ReactotronServer): Record<string, unknown> {
  const apps = getApps(server)

  if (apps.length === 0) {
    return {
      connection: "no_apps_connected",
      hint: "No apps are connected to Reactotron. Start your React Native / React app with Reactotron configured.",
    }
  }

  if (apps.length === 1) {
    return {
      connection: "single_app",
      app: apps[0],
      hint: `Connected to ${apps[0].name} (${apps[0].platform}). All data is from this app.`,
    }
  }

  return {
    connection: "multiple_apps",
    apps,
    hint: "Multiple apps are connected. If the user hasn't specified which app, ask them. Then pass clientId to filter data. Check the workspace's package.json name to see if it matches one of these app names.",
  }
}

function filterByClient(
  commands: Command[],
  server: ReactotronServer,
  clientId?: string
): Command[] {
  const apps = getApps(server)

  if (clientId) {
    return commands.filter((c) => c.clientId === clientId)
  }

  if (apps.length === 1) {
    return commands.filter((c) => c.clientId === apps[0].clientId)
  }

  return commands
}

function json(data: unknown) {
  return { contents: [{ uri: "", mimeType: "application/json" as const, text: JSON.stringify(data, null, 2) }] }
}

export function registerResources(
  mcp: McpServer,
  server: ReactotronServer,
  commandBuffer: Command[]
) {
  mcp.registerResource("timeline", "reactotron://timeline", {
    description: "Read this first to understand what's happening in the app. Shows the last 500 debug events (logs, state changes, network requests, benchmarks, custom commands) newest-first. Each event has a type, timestamp, clientId, and payload.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const events = filterByClient(commandBuffer, server)
    return json({ _meta: meta, events: [...events].reverse() })
  })

  mcp.registerResource("state", "reactotron://state/current", {
    description: "Latest cached Redux/MST state snapshot. May be stale — use the request_state tool for a fresh snapshot. Returns no_state_received if the app hasn't sent state yet.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const stateCommands = filterByClient(
      commandBuffer.filter((c) => c.type === "state.values.response"),
      server
    )
    const latest = stateCommands[stateCommands.length - 1]
    return json({
      _meta: meta,
      state: latest?.payload?.value ?? {
        status: "no_state_received",
        message: "No state snapshot received yet. Use the request_state tool to request one.",
      },
    })
  })

  mcp.registerResource("network", "reactotron://network/log", {
    description: "All captured HTTP requests and responses. Each entry has URL, method, status code, duration, headers, and body. Useful for debugging API issues.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const networkCommands = filterByClient(
      commandBuffer.filter((c) => c.type === "api.response"),
      server
    )
    return json({
      _meta: meta,
      entries: networkCommands.map((c) => ({
        messageId: c.messageId,
        clientId: c.clientId,
        date: c.date,
        ...c.payload,
      })),
    })
  })

  mcp.registerResource("apps", "reactotron://apps", {
    description: "Apps currently connected to Reactotron with their clientId, name, platform, and version. Read this to find the clientId needed for multi-app filtering.",
    mimeType: "application/json",
  }, async (uri) => {
    const apps = getApps(server)
    const meta = connectionMeta(server)
    return json({ _meta: meta, apps })
  })

  mcp.registerResource("benchmarks", "reactotron://benchmarks", {
    description: "Performance benchmark results from connected apps, sorted by time. Each has title, steps, and durations.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const benchmarks = filterByClient(
      commandBuffer.filter((c) => c.type === "benchmark.report"),
      server
    )
    return json({
      _meta: meta,
      benchmarks: benchmarks.map((c) => ({
        date: c.date,
        clientId: c.clientId,
        ...c.payload,
      })),
    })
  })
}
