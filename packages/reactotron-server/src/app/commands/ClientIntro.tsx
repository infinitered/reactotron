import React from "react"
import { Command } from "reactotron-core-ui"

export function ClientIntroTimeline({ command }: { command: Command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function ClientIntroPreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
