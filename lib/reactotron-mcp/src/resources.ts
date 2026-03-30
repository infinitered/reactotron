import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"

import {
  MAX_RESPONSE_CHARS,
  MAX_BODY_PREVIEW_CHARS,
  safeSerialize,
  summarizeCommand,
  summarizeNetworkEntry,
} from "./serialization"

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

function json(uri: URL, data: unknown, guidance?: string) {
  return {
    contents: [{
      uri: uri.href,
      mimeType: "application/json" as const,
      text: safeSerialize(data, MAX_RESPONSE_CHARS, guidance),
    }],
  }
}

export function registerResources(
  mcp: McpServer,
  server: ReactotronServer,
  commandBuffer: Command[]
) {
  mcp.registerResource("timeline", "reactotron://timeline", {
    description: "Read this first to understand what's happening in the app. Returns summarized debug events (type, timestamp, and a short preview) newest-first. Payloads are stripped to keep the response small. Use the timeline_by_type resource template to get full event data filtered by type (e.g. reactotron://timeline/api.response).",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const events = filterByClient(commandBuffer, server)
    const summarized = [...events].reverse().map(summarizeCommand)
    return json(uri, { _meta: meta, eventCount: events.length, events: summarized },
      "Events are summarized. Use the timeline_by_type resource (e.g. reactotron://timeline/api.response) to get full payloads for a specific event type.")
  })

  mcp.registerResource("timeline_by_type",
    new ResourceTemplate("reactotron://timeline/{type}", {
      list: async () => {
        const types = [...new Set(commandBuffer.map((c) => c.type))]
        return {
          resources: types.map((t) => ({
            uri: `reactotron://timeline/${t}`,
            name: `timeline:${t}`,
          })),
        }
      },
      complete: {
        type: async (value) => {
          const types = [...new Set(commandBuffer.map((c) => c.type))]
          return types.filter((t) => t.startsWith(value))
        },
      },
    }),
    {
      description: "Timeline events filtered by command type, with full payloads. Available types depend on what the app has sent (e.g. api.response, log, state.values.response, benchmark.report). Read the timeline resource first to see which types are present.",
      mimeType: "application/json",
    },
    async (uri, { type }) => {
      const meta = connectionMeta(server)
      const events = filterByClient(commandBuffer, server)
        .filter((c) => c.type === type)
      return json(uri, { _meta: meta, type, eventCount: events.length, events: [...events].reverse() },
        `Too many ${type} events to return in full. Try clear_timeline to reset, then reproduce the issue to capture fewer events.`)
    }
  )

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
    return json(uri, {
      _meta: meta,
      state: latest?.payload?.value ?? {
        status: "no_state_received",
        message: "No state snapshot received yet. Use the request_state tool to request one.",
      },
    }, "State is too large. Use the request_state tool with a path like 'user.profile' to fetch a specific slice. Use request_state_keys to explore the state shape first.")
  })

  mcp.registerResource("network", "reactotron://network/log", {
    description: "Captured HTTP requests and responses. Each entry shows URL, method, status, duration, headers, and previews of request/response bodies (truncated to 500 chars). Use timeline_by_type with type 'api.response' for full request/response data.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const networkCommands = filterByClient(
      commandBuffer.filter((c) => c.type === "api.response"),
      server
    )
    return json(uri, {
      _meta: meta,
      entries: networkCommands.map(summarizeNetworkEntry),
    }, "Network log is too large. Use timeline_by_type with type 'api.response' for full data, or clear_timeline to reset and capture fewer events.")
  })

  mcp.registerResource("apps", "reactotron://apps", {
    description: "Apps currently connected to Reactotron with their clientId, name, platform, and version. Read this to find the clientId needed for multi-app filtering.",
    mimeType: "application/json",
  }, async (uri) => {
    const apps = getApps(server)
    const meta = connectionMeta(server)
    return json(uri, { _meta: meta, apps })
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
    return json(uri, {
      _meta: meta,
      benchmarks: benchmarks.map((c) => ({
        date: c.date,
        clientId: c.clientId,
        ...c.payload,
      })),
    })
  })

  mcp.registerResource("subscriptions", "reactotron://state/subscriptions", {
    description: "State subscription changes. Shows values at subscribed paths whenever they change. Use the subscribe_state tool to add subscriptions.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const changes = filterByClient(
      commandBuffer.filter((c) => c.type === "state.values.change"),
      server
    )
    return json(uri, {
      _meta: meta,
      activeSubscriptions: (server as any).subscriptions || [],
      changes: changes.map((c) => ({
        date: c.date,
        clientId: c.clientId,
        ...c.payload,
      })),
    }, "Subscription changes are too large. Consider unsubscribing from paths with large values, or use request_state with a specific path instead.")
  })

  mcp.registerResource("asyncstorage", "reactotron://asyncstorage", {
    description: "AsyncStorage mutations captured from the app. Shows setItem, removeItem, mergeItem, multiSet, multiRemove, multiMerge, and clear operations with their keys and values.",
    mimeType: "application/json",
  }, async (uri) => {
    const meta = connectionMeta(server)
    const mutations = filterByClient(
      commandBuffer.filter((c) => c.type === "asyncStorage.mutation"),
      server
    )
    return json(uri, {
      _meta: meta,
      mutations: mutations.map((c) => ({
        date: c.date,
        clientId: c.clientId,
        action: c.payload?.action,
        data: c.payload?.data,
      })),
    }, "AsyncStorage mutations are too large. Try clear_timeline to reset, then reproduce the specific interaction you want to inspect.")
  })
}
