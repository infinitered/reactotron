---
sidebar_position: 6
title: MCP Server (Claude Code)
---

Reactotron includes a built-in [MCP](https://modelcontextprotocol.io/) server that lets AI coding assistants like [Claude Code](https://claude.ai/claude-code) read your app's debug events and send commands — all within a coding conversation.

## Getting started

1. Open Reactotron and connect your app as usual.
2. Click the **MCP** button in the footer bar to start the server. The MCP server is **off by default** — you need to toggle it on before Claude Code can connect. A green dot indicates the server is running.
3. In your terminal, add the MCP server to Claude Code:

```bash
claude mcp add --transport http reactotron http://localhost:4567/mcp
```

That's it. Claude Code can now read your app's timeline, inspect state, dispatch actions, and more.

## What can Claude Code do?

### Read debug data

Claude Code can read these resources on demand:

- **Timeline** — summarized debug events (type, timestamp, and a short preview) newest-first. Payloads are kept small so the response stays within token limits.
- **Timeline by Type** — full event data filtered by command type (e.g. `api.response`, `log`). Use this to drill into specific event types after reading the timeline summary.
- **App State** — the latest cached Redux/MST state snapshot
- **Network Log** — HTTP requests and responses with truncated body previews
- **Connected Apps** — which apps are connected, with their platform and version
- **Benchmarks** — performance benchmark results
- **State Subscriptions** — values at subscribed state paths whenever they change
- **AsyncStorage** — all AsyncStorage mutations (setItem, removeItem, etc.)

### Send commands

Claude Code can also interact with your running app:

- **Dispatch Redux actions** — e.g. "dispatch a RESET action"
- **Explore state keys** — list keys at any state path without fetching values (lightweight way to navigate the state tree)
- **Request a fresh state snapshot** — asks the app for current state at a specific path
- **Replace app state** — hot-swap the entire state tree
- **Send custom commands** — trigger any custom command registered in your app
- **Show image overlay** — overlay a design mockup on the running app (supports local files)
- **Subscribe to state paths** — watch specific parts of state for changes
- **Clear the event buffer** — reset what Claude sees to focus on new interactions

### Multi-app support

If multiple apps are connected to Reactotron, Claude Code will ask which app you're working on. It can auto-detect the right app when only one is connected.

## Configuration

The MCP port defaults to **4567** and can be changed in Reactotron's settings (stored via electron-store as `mcpPort`).

The server only binds to `127.0.0.1` (localhost) and is not accessible from other machines on your network.

## Image overlay

The `show_overlay` tool lets Claude Code overlay an image on your running app — useful for comparing a design mockup against the actual UI.

```text
"Show the design mockup from ~/Downloads/design.png as an overlay on the app"
```

- Accepts local file paths, `file://` URIs, `http://` URLs, or `data:` URIs
- Local files are automatically converted to base64
- Image dimensions are extracted from PNG/JPEG/GIF headers
- Supported formats: **PNG, JPEG, GIF**

## Example conversation

> **You:** "Look at the Reactotron timeline and tell me what's happening"
>
> **Claude:** _reads the timeline summary_ "I can see 3 API calls failing with 401 errors and some state changes. Let me get the full details on those failed requests."
>
> **Claude:** _reads timeline/api.response_ "All three requests to `/api/users`, `/api/orders`, and `/api/profile` are returning 401 Unauthorized. Your auth token might be expired. Want me to check the current state?"
>
> **You:** "Yes, check the auth state"
>
> **Claude:** _calls request_state_keys, then request_state with path='auth'_ "The auth token in state is empty. It looks like the login flow isn't saving the token. Let me look at the Redux actions..."

## Architecture

The MCP server runs inside the Reactotron desktop app as a separate package (`reactotron-mcp`). It reads directly from the relay server's connections and event stream — no proxy, no separate process, and no changes to your React Native app.

```text
React Native app
    | WebSocket (port 9090, unchanged)
    v
Reactotron Desktop
    ├── relay server (reactotron-core-server)
    └── MCP server (reactotron-mcp, HTTP on configurable port)
          ↑
Claude Code
```
