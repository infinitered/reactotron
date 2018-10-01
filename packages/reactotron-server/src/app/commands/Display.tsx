import React from "react"
import { Command } from "reactotron-core-ui"

export function DisplayTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function DisplayPreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
