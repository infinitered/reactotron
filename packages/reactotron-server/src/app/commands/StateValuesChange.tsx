import React from "react"

export function StateValuesChangeTimeline({ command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function StateValuesChangePreview({ command }) {
  return <span>{command.payload.name}</span>
}