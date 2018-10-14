import React from "react"
import { Command, Text, VariableRenderer } from "reactotron-core-ui"

export function ImageTimeline({ command }: { command: Command }) {
  return <VariableRenderer value={command.payload} />
}

export function ImagePreview({ command }: { command: Command }) {
  return <Text text={command.payload.name} />
}
