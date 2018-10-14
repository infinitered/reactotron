import React from "react"
import { Command } from "reactotron-core-ui"
import { VariableRenderer, Text } from "reactotron-core-ui"

// TODO: Change over the name to use the Text component too!

export function DisplayTimeline({ command }: { command: Command }) {
  return (
    <div>
      <div className="mx-2 my-2">
        <span className="text-highlight">{command.payload.name}</span>
      </div>
      <div>
        <VariableRenderer value={command.payload.value} />
      </div>
    </div>
  )
}

export function DisplayPreview({ command }: { command: Command }) {
  return <Text text={command.payload.name} />
}
