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

## Redaction

Reactotron applies a default-on redaction pass to every MCP response, replacing well-known sensitive field names and token formats with `[REDACTED]` before they leave the server. A shield icon next to the MCP button reflects the live state: **green** while redaction is fully enforced, **amber** when at least one connected client has opted out via a permission you've granted. Redaction is defence in depth — see the [Limitations and gotchas](#limitations-and-gotchas) section for the audit you should do before connecting an LLM.

### What gets redacted

Out of the box, the following are replaced with `[REDACTED]`:

- **Sensitive keys** (matched at any nesting level, case-insensitive) — credentials like `password`/`passwd`/`pwd`, `secret`, `client_secret`, `private_key`, `credentials`, `ssn`, `creditcard`; API keys like `api_key`/`apikey`/`x-api-key`; auth tokens like `token`, `bearer`, `jwt`, `access_token`, `refresh_token`, `id_token`; session/CSRF like `session`/`sessionid`, `csrf`/`xsrf`; HTTP header names like `Authorization`, `Cookie`, `Set-Cookie`, `Proxy-Authorization`, `X-Auth-Token`, `X-CSRF-Token`, `X-XSRF-Token`, `X-Forwarded-For`, `X-Real-IP`; and common variants
- **String values** matching common token formats — Bearer tokens, JWTs (`eyJ...`), OpenAI keys (`sk-...`), Anthropic keys (`sk-ant-...`), GitHub PATs/OAuth/user-to-server tokens (`ghp_/ghs_/gho_/ghu_/ghr_...`), Slack tokens (`xoxb-...`), AWS access key IDs (`AKIA...`), Google API keys (`AIza...`), Stripe keys (`sk_live_/pk_test_/...`), and PEM-encoded private key blocks
- **URL query parameters** whose names match any sensitive key (e.g. `?api_key=abc` becomes `?api_key=[REDACTED]`)
- **Form-urlencoded bodies** — strings shaped like `k=v&k=v` (e.g. `application/x-www-form-urlencoded` request bodies) get the same per-field redaction as URL query parameters

### Configuring redaction in Reactotron

Click the gear icon next to the MCP button to open the redaction settings modal. From there you can:

- Add or remove **sensitive keys** (covers both payload field names and HTTP header names), **state path patterns**, and **value patterns** (regex)
- Toggle whether connected apps are allowed to **disable redaction entirely** (off by default)
- Toggle whether connected apps are allowed to **remove default rules** (off by default)

State path patterns use dot-separated paths and support a trailing wildcard. For example, `auth.tokens.*` redacts every key under `auth.tokens` in your app state.

Changes take effect on the next MCP request — no restart needed.

### Client-side configuration

Apps can send redaction preferences during the Reactotron connection handshake via the `mcpRedaction` option:

```js
Reactotron.configure({
  // ... other options
  mcpRedaction: {
    // Merge additional rules on top of server defaults (always allowed)
    additionalRules: {
      sensitiveKeys: ["myInternalField", "x-internal-auth"],
    },
    // Request removal of specific default rules (requires server permission)
    removeRules: {
      sensitiveKeys: ["cookie"],
    },
    // Request disabling redaction entirely (requires server permission)
    disableRedaction: true,
  },
})
```

This uses a **two-key model**: the server always applies its default rules unless *both* the client requests a relaxation *and* the server has enabled the corresponding permission in the settings modal. This prevents a misconfigured app from accidentally exposing secrets.

### Multi-app redaction

When multiple apps are connected, **each app's data is redacted with that app's own configuration**, even within a single MCP response that aggregates events from several apps (timeline, network, asyncstorage, etc.). One app's `additionalRules` won't redact another app's data, and one app's `removeRules` won't weaken redaction for any other app's data.

### Limitations and gotchas

> **Audit your app's payloads before pointing an LLM at the MCP server.** Redaction is defence in depth, not a guarantee. The default rules catch widely-used names and token formats, but anything app-specific (custom field names, homegrown token shapes, bare values without a recognisable shape) passes through unredacted. Do the audit *before* connecting any LLM — once an LLM has seen a secret, you can't unsend it. Two practical ways to audit: search your codebase for the field names you store credentials, tokens, or PII under, and inspect a normal Reactotron desktop session (the desktop UI is unredacted, so what you see there is roughly what an LLM would see minus the default-rule matches). Add anything sensitive to `additionalRules` (or to the desktop's settings modal) before the first LLM connection.

A few specific things worth knowing:

- **The Reactotron desktop UI is not redacted.** Redaction only happens at the MCP boundary. The desktop UI shows captured data verbatim — that's by design, since you're debugging your own app.
- **Redaction is a blocklist, not an allowlist.** Field names that aren't in `sensitiveKeys` and string values that don't match any `valuePatterns` regex pass through verbatim. A field literally called `mySpecialSecret` or a homegrown token format like `xz-…-…` is invisible to the default rules. Add them via the settings modal or `additionalRules`.
- **AsyncStorage values rely on the storage key carrying the sensitive name.** `AsyncStorage.setItem("auth:password", "hunter2")` redacts because the storage key contains `password`. `AsyncStorage.setItem("appData", "hunter2")` does *not* — neither the key nor the bare value match any default rule, so the value passes through verbatim. If your app stores secrets under non-descriptive storage keys, redaction won't help. Use the `ignore` option on the AsyncStorage plugin to skip those keys entirely.
- **State path patterns only fire at known anchors.** The `reactotron://state/current` resource and the `request_state` tool both pass the originating state path so absolute patterns (e.g. `auth.tokens.*`) match correctly. Other resources don't carry that anchor and can't apply path-based rules. If a sensitive subtree never matches by key name or value pattern, path patterns alone may not catch it.
- **State path patterns support trailing wildcard only.** `auth.tokens.*` works. `users.*.password` does not — you'd need to add `password` to `sensitiveKeys` (it already is by default) or list each path explicitly.
- **Custom commands and `display` payloads are walked generically.** If you emit free-form data via `Reactotron.display(...)` or a custom command, only key-name and value-pattern rules apply. Sensitive content in arbitrary shapes is on you.
- **Server defaults apply at the boundary, not at storage.** The relay server still receives the full payload over the WebSocket and stores it in the in-memory event buffer. Anyone with desktop access (or who can attach a debugger to the Reactotron process) can see the unredacted data. Redaction stops the data from reaching the MCP client; it does not encrypt anything at rest.

## Configuration

The MCP port defaults to **4567**. There's no in-app UI to change it; the value is stored as `mcpPort` in Reactotron's electron-store config — at `~/Library/Application Support/Reactotron/config.json` on macOS, `%APPDATA%\Reactotron\config.json` on Windows, or `~/.config/Reactotron/config.json` on Linux. Edit the JSON and restart Reactotron to pick up the new port.

The server only binds to `127.0.0.1` (localhost) and is not accessible from other machines on your network.

The MCP buffer holds the most recent **500 commands** from the relay. Once that fills, the oldest events drop off — the timeline / network / state resources only reflect what's still in the buffer. Use the `clear_timeline` tool to reset it before reproducing a specific issue.

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
