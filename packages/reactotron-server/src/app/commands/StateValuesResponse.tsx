import React from "react"
import { Command } from "reactotron-core-ui"

export function StateValuesResponseTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function StateValuesResponsePreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
