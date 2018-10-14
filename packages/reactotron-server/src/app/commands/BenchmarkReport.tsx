import React from "react"
import { Command, Text, VariableRenderer } from "reactotron-core-ui"

export function BenchmarkReportTimeline({ command }: { command: Command }) {
  return <VariableRenderer value={command.payload} />
}

export function BenchmarkReportPreview({ command }: { command: Command }) {
  return <Text text={command.payload.name} />
}
