import type ReactotronServer from "reactotron-core-server"
import type { Command } from "reactotron-core-contract"

export function getResources() {
  return [
    {
      uri: "reactotron://timeline",
      name: "Reactotron Timeline",
      description: "Recent debug events from connected apps. Each event has type, date, clientId, and payload.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://state/current",
      name: "Current App State",
      description: "Latest Redux/MST state snapshot from the connected app.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://network/log",
      name: "Network Request Log",
      description: "Recent network requests/responses from connected apps.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://apps",
      name: "Connected Apps",
      description: "Apps currently connected to Reactotron.",
      mimeType: "application/json",
    },
    {
      uri: "reactotron://benchmarks",
      name: "Benchmark Results",
      description: "Performance benchmark results from connected apps.",
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

export async function readResource(
  uri: string,
  server: ReactotronServer,
  commandBuffer: Command[]
): Promise<unknown> {
  if (uri === "reactotron://timeline") {
    return {
      _meta: {
        description: "Array of Reactotron debug events, newest first. Each has 'type', 'date', 'clientId', and 'payload'.",
      },
      events: [...commandBuffer].reverse(),
    }
  }

  if (uri === "reactotron://state/current") {
    const stateCommands = commandBuffer.filter((c) => c.type === "state.values.response")
    const latest = stateCommands[stateCommands.length - 1]
    return {
      _meta: {
        description: "Most recent state snapshot. Use the request_state tool to request a fresh one.",
      },
      state: latest?.payload?.value ?? {
        status: "no_state_received",
        message: "No state snapshot received yet. Use the request_state tool to request one.",
      },
    }
  }

  if (uri === "reactotron://network/log") {
    const networkCommands = commandBuffer.filter((c) => c.type === "api.response")
    return {
      _meta: {
        description: "Array of network requests. Each has request (url, method) and response (status, body, duration).",
      },
      entries: networkCommands.map((c) => ({
        messageId: c.messageId,
        clientId: c.clientId,
        date: c.date,
        ...c.payload,
      })),
    }
  }

  if (uri.startsWith("reactotron://network/")) {
    const id = uri.replace("reactotron://network/", "")
    const entry = commandBuffer.find(
      (c) => c.type === "api.response" && String(c.messageId) === id
    )
    if (!entry) {
      return { error: `Network entry '${id}' not found` }
    }
    return { messageId: entry.messageId, clientId: entry.clientId, date: entry.date, ...entry.payload }
  }

  if (uri === "reactotron://apps") {
    return {
      _meta: {
        description: "Connected apps. Use clientId when calling tools with multiple apps connected.",
      },
      apps: (server.connections as any[]).map((c) => ({
        id: c.id,
        clientId: c.clientId,
        name: c.name,
        platform: c.platform,
        platformVersion: c.platformVersion,
      })),
    }
  }

  if (uri === "reactotron://benchmarks") {
    const benchmarks = commandBuffer.filter((c) => c.type === "benchmark.report")
    return {
      _meta: { description: "Benchmark results sorted by time." },
      benchmarks: benchmarks.map((c) => ({
        date: c.date,
        clientId: c.clientId,
        ...c.payload,
      })),
    }
  }

  return { error: `Unknown resource: ${uri}` }
}
