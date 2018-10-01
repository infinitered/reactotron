import React from "react"
import { Command } from "reactotron-core-ui"

export function SagaTaskTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function SagaTaskPreview({ command }: { command: Command }) {
  return <span>{command.type}</span>
}
