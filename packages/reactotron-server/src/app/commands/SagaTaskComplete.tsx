import React from "react"
import { Command } from "reactotron-core-ui"
import { JsonTree } from "reactotron-core-ui"

export function SagaTaskTimeline({ command }: { command: Command }) {
  return (
    <div>
      <div className="mx-2 my-2">
        <span className="text-highlight">{command.payload.name}</span>
      </div>
      <div>
        <JsonTree data={command.payload} />
      </div>
    </div>
  )
}

export function SagaTaskPreview({ command }: { command: Command }) {
  return <span>{command.type}</span>
}
