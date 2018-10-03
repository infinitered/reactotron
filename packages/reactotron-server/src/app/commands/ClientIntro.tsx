import React from "react"
import { Command, makeTable } from "reactotron-core-ui"

export function ClientIntroTimeline({ command }: { command: Command }) {
  return makeTable(command.payload)
}

export function ClientIntroPreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
