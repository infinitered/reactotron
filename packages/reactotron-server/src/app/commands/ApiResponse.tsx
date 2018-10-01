import React from "react"
import { Command } from "reactotron-core-ui"

export function ApiResponseTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload.request)}</span>
}

export function ApiResponsePreview({ command }: { command: Command }) {
  return <span>{command.payload.request.url}</span>
}
