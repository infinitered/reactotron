import React from "react"

export function StateActionCompleteTimeline({ command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function StateActionCompletePreview({ command }) {
  return <span>{command.payload.name}</span>
}

