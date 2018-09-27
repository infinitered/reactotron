import React from "react"

export function ApiResponseTimeline({ command }) {
  return <span>{JSON.stringify(command.payload.request)}</span>
}

export function ApiResponsePreview({ command }) {
  return <span>{command.payload.request.url}</span>
}
