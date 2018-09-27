import React from "react"

export function SagaTaskTimeline({ command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function SagaTaskPreview({ command }) {
  return <span>{command.type}</span>
}
