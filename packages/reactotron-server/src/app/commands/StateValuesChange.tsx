import React from "react"
import { Command } from "reactotron-core-ui"

export function StateValuesChangeTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function StateValuesChangePreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
