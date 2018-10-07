import React from "react"
import { Command } from "reactotron-core-ui"
import { JsonTree } from "reactotron-core-ui"

export function StateActionCompleteTimeline({ command }: { command: Command }) {
  return (
    <div>
      <div className="mx-2 my-2">
        <span className="text-highlight">{command.payload.name}</span>
      </div>
      <div>
        <JsonTree data={command.payload.action} />
      </div>
    </div>
  )
}

export function StateActionCompletePreview({ command }: { command: Command }) {
  return <span>{command.payload.name}</span>
}
