import { rightPad } from "../Lib/pad"

function tableToMarkdown(table) {
  const lines = []

  // find the lengths
  let keyLength = 0
  let valueLength = 0
  for (const key in table) {
    keyLength = Math.max(keyLength, key.length)
    valueLength = Math.max(valueLength, (table[key] || "").length)
  }

  // helpers for drawing fixed widths
  const keyPad = (value = "") => rightPad(value, keyLength)
  const valuePad = (value = "") => rightPad(value, valueLength)
  const add = (key = "", value = "") =>
    lines.push(`${keyPad(key || "")} | ${valuePad(value || "")}`)

  // header
  add("key", "value")

  // divider
  lines.push(`${"-".repeat(keyLength)} | ${"-".repeat(valueLength)}`)

  // each line
  for (const key in table) {
    add(key, table[key])
  }

  return lines.join("\n")
}

export function apiToMarkdown(payload = {}) {
  const lines = []
  const request = payload.request || {}

  lines.push("# Request")

  lines.push("")
  lines.push("### Endpoint")
  lines.push("")
  lines.push(`\`${request.method || ""}\` ${request.url || ""}`.trim())

  if (typeof payload.duration === "number") {
    lines.push("")
    lines.push("### Duration")
    lines.push("")
    lines.push(`\`${payload.duration.toFixed(0)}\` ms`)
  }

  // request data
  if (request.data) {
    let data = request.data
    // attempt to jsonify the request data
    try {
      data = JSON.stringify(JSON.parse(data), null, 2)
    } catch (e) {}

    if (data) {
      lines.push("")
      lines.push("### Data Sent")
      lines.push("")
      lines.push("```json")
      lines.push(data)
      lines.push("```")
    }
  }

  // request headers
  if (request.headers && Object.keys(request.headers).length > 0) {
    lines.push("")
    lines.push("### Headers")
    lines.push("")
    lines.push(tableToMarkdown(request.headers))
  }

  if (payload.response) {
    const response = payload.response || {}

    lines.push("")
    lines.push("# Response")

    if (response.status) {
      lines.push("")
      lines.push("### Status Code")
      lines.push("")
      lines.push(`\`${response.status}\``)
    }

    // response data
    if (response.body) {
      let body = response.body
      // attempt to jsonify the request data
      try {
        if (typeof body === "string") {
          body = JSON.parse(body)
        }
        body = JSON.stringify(body, null, 2)
      } catch (e) {}

      if (body) {
        lines.push("")
        lines.push("### Data Received")
        lines.push("")
        lines.push("```json")
        lines.push(body)
        lines.push("```")
      }
    }

    // response headers
    if (response.headers && Object.keys(response.headers).length > 0) {
      lines.push("")
      lines.push("### Headers")
      lines.push("")
      lines.push(tableToMarkdown(response.headers))
    }
  }

  lines.push("")
  return lines.join("\n")
}
