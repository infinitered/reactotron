import React from "react"
import { Command, Text, VariableRenderer } from "reactotron-core-ui"

export function LogTimeline({ command }: { command: Command }) {
  return <VariableRenderer value={command.payload} />
}

export function LogPreview({ command }: { command: Command }) {
  return <Text text={command.payload.name} />
}
