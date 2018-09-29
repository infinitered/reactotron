import React from "react"

export function DisplayTimeline({ command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function DisplayPreview({ command }) {
  return <span>{command.payload.name}</span>
}

