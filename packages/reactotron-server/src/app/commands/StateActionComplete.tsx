import React from "react"
import { Command } from "reactotron-core-ui"

export function StateActionCompleteTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function StateActionCompletePreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
