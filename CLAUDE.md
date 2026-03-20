# Reactotron MCP Integration

## What this is

MCP (Model Context Protocol) support embedded in the Reactotron desktop app, allowing Claude Code to read debug events and send commands to connected React Native / React apps.

## Architecture

```
React Native app
    | WebSocket (unchanged, port 9090)
    v
Reactotron Desktop (Electron app)
    ├── relay server (reactotron-core-server, port 9090)
    └── MCP server (reactotron-mcp, HTTP on port 4567)
          ↑ Claude Code connects directly via HTTP MCP transport
          |
Claude Code
```

**Separation of concerns:**

- `lib/reactotron-core-server` — relay, connections, commands, event emitter. Unchanged.
- `lib/reactotron-mcp` — MCP resource/tool definitions, `@modelcontextprotocol/sdk` HTTP transport. Receives the Server instance, reads connections/commands, sends commands through it. Built with **tsup** (not react-native-builder-bob — this is a Node.js server, not a React Native lib). Bundles `@modelcontextprotocol/sdk` because its CJS exports are broken.
- `apps/reactotron-app` — imports `reactotron-mcp`, passes it the Server instance, wires the MCP toggle button in the footer.

**Key pattern:** Stateless per-request MCP transport. Each HTTP POST to `/mcp` creates a new `McpServer` + `StreamableHTTPServerTransport` instance, handles the request, then cleans up on response close. This is required by the MCP SDK for stateless mode.

## Claude Code config

```bash
claude mcp add --transport http reactotron http://localhost:4567/mcp
```

## How to run locally

```bash
yarn install
yarn start        # launches Electron dev app
```

Click the "MCP" button in the footer bar to start the MCP server on port 4567.

## MCP Resources

| Resource | URI | Description |
|----------|-----|-------------|
| Timeline | `reactotron://timeline` | Last 500 debug events (logs, state, network, etc.) |
| State | `reactotron://state/current` | Latest cached state snapshot |
| Network | `reactotron://network/log` | HTTP request/response log |
| Apps | `reactotron://apps` | Connected apps with clientIds |
| Benchmarks | `reactotron://benchmarks` | Performance benchmark results |
| Subscriptions | `reactotron://state/subscriptions` | Active state subscriptions and change events |
| AsyncStorage | `reactotron://asyncstorage` | AsyncStorage mutations (setItem, removeItem, etc.) |

All resources include `_meta` with connection context (single app auto-selected, multiple apps listed with guidance to ask user).

## MCP Tools

| Tool | Description |
|------|-------------|
| `dispatch_action` | Dispatch Redux action, polls for confirmation |
| `request_state` | Request fresh state snapshot (1.5s timeout) |
| `swap_state` | Replace entire app state tree |
| `send_custom_command` | Send named custom command to app |
| `list_custom_commands` | List commands registered by the app |
| `show_overlay` | Image overlay on app (file→base64, dimension extraction) |
| `clear_timeline` | Clear MCP event buffer (not desktop app timeline) |
| `subscribe_state` | Subscribe to state path changes |
| `unsubscribe_state` | Unsubscribe from state path |

## Known issues / gotchas

- **Dynamic `import()` crashes Electron renderer.** Use static imports only in tools.ts/resources.ts. tsup bundles them at build time.
- **zod v3/v4 type mismatch in IDE.** The MCP SDK uses zod v4 internally but our `import { z } from "zod"` resolves to v3 for types. Build works fine (tsup bundles the right version). IDE errors are cosmetic.
- **Overlay image formats:** Only PNG, JPEG, GIF supported. WebP crashes Reactotron (Electron's nativeImage limitation).
- **Debug logging** goes to `/tmp/reactotron-mcp.log` — keep this until implementation is stable.

## Key files

- `lib/reactotron-mcp/src/mcp-server.ts` — HTTP server, per-request MCP transport
- `lib/reactotron-mcp/src/resources.ts` — MCP resource definitions
- `lib/reactotron-mcp/src/tools.ts` — MCP tool definitions
- `lib/reactotron-mcp/tsup.config.ts` — build config (bundles MCP SDK, externalizes reactotron packages)
- `apps/reactotron-app/src/renderer/contexts/Standalone/index.tsx` — MCP state/toggle
- `apps/reactotron-app/src/renderer/components/Footer/Stateless.tsx` — MCP button UI

## Repository

- Branch: `feat/mcp-server`
- Origin: `kbrandwijk/reactotron` (fork)
- Upstream: `infinitered/reactotron`
