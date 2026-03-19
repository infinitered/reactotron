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

/**
 * Build connection context metadata. Helps Claude decide whether to ask
 * the user which app to focus on or just use the only connected one.
 */
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

/**
 * Filter commands by clientId. If no clientId given and only one app
 * is connected, auto-filter to that app.
 */
function filterByClient(
  commands: Command[],
  server: ReactotronServer,
  clientId?: string
): Command[] {
  const apps = getApps(server)

  // Explicit clientId — filter to it
  if (clientId) {
    return commands.filter((c) => c.clientId === clientId)
  }

  // Single app — auto-filter
  if (apps.length === 1) {
    return commands.filter((c) => c.clientId === apps[0].clientId)
  }

  // Multiple apps, no filter — return all
  return commands
}

export function getResources() {
  return [
    {
      uri: "reactotron://timeline",
      name: "Reactotron Timeline",
      description: "Recent debug events from connected apps. Append ?clientId=<id> to filter to a specific app.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://state/current",
      name: "Current App State",
      description: "Latest Redux/MST state snapshot. Append ?clientId=<id> to target a specific app.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://network/log",
      name: "Network Request Log",
      description: "Recent network requests/responses. Append ?clientId=<id> to filter to a specific app.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://apps",
      name: "Connected Apps",
      description: "Apps currently connected to Reactotron. Read this first to find the clientId for the app you're debugging.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://benchmarks",
      name: "Benchmark Results",
      description: "Performance benchmark results. Append ?clientId=<id> to filter to a specific app.",
      mimeType: "application/json",
    },
  ]
}

export function getResourceTemplates() {
  return [
    {
      uriTemplate: "reactotron://network/{id}",
      name: "Network Request Detail",
      description: "Full detail for a single network request by message ID.",
      mimeType: "application/json",
    },
  ]
}

function parseUri(uri: string): { path: string; params: Record<string, string> } {
  const [path, query] = uri.split("?", 2)
  const params: Record<string, string> = {}
  if (query) {
    for (const part of query.split("&")) {
      const [k, v] = part.split("=", 2)
      if (k && v) params[decodeURIComponent(k)] = decodeURIComponent(v)
    }
  }
  return { path, params }
}

export async function readResource(
  uri: string,
  server: ReactotronServer,
  commandBuffer: Command[]
): Promise<unknown> {
  const { path, params } = parseUri(uri)
  const clientId = params.clientId
  const meta = connectionMeta(server)

  if (path === "reactotron://timeline") {
    const events = filterByClient(commandBuffer, server, clientId)
    return {
      _meta: {
        description: "Debug events, newest first. Each has 'type' (log, api.response, state.values.response, etc.), 'date', 'clientId', and 'payload'.",
        ...meta,
      },
      events: [...events].reverse(),
    }
  }

  if (path === "reactotron://state/current") {
    const stateCommands = filterByClient(
      commandBuffer.filter((c) => c.type === "state.values.response"),
      server,
      clientId
    )
    const latest = stateCommands[stateCommands.length - 1]
    return {
      _meta: {
        description: "Most recent state snapshot. Use the request_state tool to request a fresh one.",
        ...meta,
      },
      state: latest?.payload?.value ?? {
        status: "no_state_received",
        message: "No state snapshot received yet. Use the request_state tool to request one.",
      },
    }
  }

  if (path === "reactotron://network/log") {
    const networkCommands = filterByClient(
      commandBuffer.filter((c) => c.type === "api.response"),
      server,
      clientId
    )
    return {
      _meta: {
        description: "Network requests. Each has request (url, method) and response (status, body, duration).",
        ...meta,
      },
      entries: networkCommands.map((c) => ({
        messageId: c.messageId,
        clientId: c.clientId,
        date: c.date,
        ...c.payload,
      })),
    }
  }

  if (path.startsWith("reactotron://network/")) {
    const id = path.replace("reactotron://network/", "")
    const entry = commandBuffer.find(
      (c) => c.type === "api.response" && String(c.messageId) === id
    )
    if (!entry) {
      return { error: `Network entry '${id}' not found` }
    }
    return { messageId: entry.messageId, clientId: entry.clientId, date: entry.date, ...entry.payload }
  }

  if (path === "reactotron://apps") {
    const apps = getApps(server)
    return {
      _meta: {
        description: apps.length <= 1
          ? "Connected apps."
          : "Multiple apps connected. Check the workspace's package.json name — if it matches one of these app names, use that clientId. Otherwise, ask the user which app they're debugging.",
        ...meta,
      },
      apps,
    }
  }

  if (path === "reactotron://benchmarks") {
    const benchmarks = filterByClient(
      commandBuffer.filter((c) => c.type === "benchmark.report"),
      server,
      clientId
    )
    return {
      _meta: {
        description: "Benchmark results sorted by time.",
        ...meta,
      },
      benchmarks: benchmarks.map((c) => ({
        date: c.date,
        clientId: c.clientId,
        ...c.payload,
      })),
    }
  }

  return { error: `Unknown resource: ${uri}` }
}
