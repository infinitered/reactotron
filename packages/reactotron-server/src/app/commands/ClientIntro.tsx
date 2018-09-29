import React from "react"

export function ClientIntroTimeline({ command }) {
  return <span>{JSON.stringify(command.payload)}</span>
}

export function ClientIntroPreview({ command }) {
  return <span>{command.payload.name}</span>
}
