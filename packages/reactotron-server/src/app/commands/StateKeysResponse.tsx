import React from "react"
import { Command } from "reactotron-core-ui"

export function StateKeysResponseTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function StateKeysResponsePreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
