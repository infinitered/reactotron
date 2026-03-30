import type { Command } from "reactotron-core-contract"

export const MAX_RESPONSE_CHARS = 800_000
export const MAX_PAYLOAD_PREVIEW_CHARS = 200
export const MAX_BODY_PREVIEW_CHARS = 500

/** Serialize data as compact (no indentation) JSON. */
export function compactJson(data: unknown): string {
  return JSON.stringify(data)
}

/**
 * Truncate a string to a character limit, appending a guidance message
 * that tells the LLM how to get more specific data.
 */
export function truncate(text: string, limit: number, guidance?: string): string {
  if (text.length <= limit) return text

  const suffix = guidance
    ? `\n\n[TRUNCATED — response was ~${(text.length / 1000).toFixed(0)}K chars. ${guidance}]`
    : `\n\n[TRUNCATED — response was ~${(text.length / 1000).toFixed(0)}K chars.]`

  return text.slice(0, limit - suffix.length) + suffix
}

/**
 * Serialize data as compact JSON, then truncate if it exceeds the limit.
 * The guidance string tells the LLM what to do to get a smaller response.
 */
export function safeSerialize(
  data: unknown,
  limit: number = MAX_RESPONSE_CHARS,
  guidance?: string
): string {
  const text = compactJson(data)
  return truncate(text, limit, guidance)
}

/** One-line preview of an api.response command payload. */
function apiResponsePreview(payload: any): string {
  const method = payload?.request?.method ?? "?"
  const url = payload?.request?.url ?? "?"
  const status = payload?.response?.status ?? "?"
  const duration = payload?.duration != null ? ` (${payload.duration}ms)` : ""
  return `${method} ${url} -> ${status}${duration}`
}

/** One-line preview of a log command payload. */
function logPreview(payload: any): string {
  const level = payload?.level ?? "log"
  let msg = typeof payload?.message === "string" ? payload.message : compactJson(payload?.message)
  if (msg.length > MAX_PAYLOAD_PREVIEW_CHARS) {
    msg = msg.slice(0, MAX_PAYLOAD_PREVIEW_CHARS) + "..."
  }
  return `[${level}] ${msg}`
}

/** Generic short preview of a payload. */
function genericPreview(payload: any): string {
  if (payload == null) return ""
  const text = compactJson(payload)
  if (text.length <= MAX_PAYLOAD_PREVIEW_CHARS) return text
  return text.slice(0, MAX_PAYLOAD_PREVIEW_CHARS) + "..."
}

/**
 * Summarize a Command for timeline overview: keeps metadata fields,
 * replaces payload with a short type-specific preview string.
 */
export function summarizeCommand(cmd: Command): object {
  let preview: string
  switch (cmd.type) {
    case "api.response":
      preview = apiResponsePreview(cmd.payload)
      break
    case "log":
      preview = logPreview(cmd.payload)
      break
    case "state.values.response":
      preview = `path: ${(cmd.payload as any)?.path ?? "(root)"}`
      break
    case "state.values.change":
      preview = `${((cmd.payload as any)?.changes ?? []).length} change(s)`
      break
    case "state.action.complete":
      preview = (cmd.payload as any)?.type ?? genericPreview(cmd.payload)
      break
    case "benchmark.report":
      preview = (cmd.payload as any)?.title ?? "benchmark"
      break
    default:
      preview = genericPreview(cmd.payload)
      break
  }

  return {
    type: cmd.type,
    date: cmd.date,
    clientId: cmd.clientId,
    messageId: cmd.messageId,
    deltaTime: cmd.deltaTime,
    important: cmd.important,
    payloadPreview: preview,
  }
}

/**
 * Summarize a network (api.response) command: keeps URL, method, status,
 * duration, and truncated previews of request/response bodies.
 */
export function summarizeNetworkEntry(cmd: Command): object {
  const p = cmd.payload as any
  const requestData = p?.request?.data != null
    ? truncateValue(p.request.data, MAX_BODY_PREVIEW_CHARS)
    : undefined
  const responseBody = typeof p?.response?.body === "string"
    ? (p.response.body.length > MAX_BODY_PREVIEW_CHARS
      ? p.response.body.slice(0, MAX_BODY_PREVIEW_CHARS) + "..."
      : p.response.body)
    : p?.response?.body != null
      ? truncateValue(p.response.body, MAX_BODY_PREVIEW_CHARS)
      : undefined

  return {
    messageId: cmd.messageId,
    clientId: cmd.clientId,
    date: cmd.date,
    duration: p?.duration,
    request: {
      method: p?.request?.method,
      url: p?.request?.url,
      headers: p?.request?.headers,
      data: requestData,
    },
    response: {
      status: p?.response?.status,
      headers: p?.response?.headers,
      body: responseBody,
    },
  }
}

/** Truncate any value to a compact JSON preview. */
function truncateValue(value: unknown, limit: number): string {
  const text = typeof value === "string" ? value : compactJson(value)
  if (text.length <= limit) return text
  return text.slice(0, limit) + "..."
}
