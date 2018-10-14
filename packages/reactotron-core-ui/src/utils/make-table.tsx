import React from "react"

// TODO: Pull over styling and such from makeTable in the current app

function getTextForValue(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return value
}

function makeRow(key, value) {
  return (
    <tr>
      <td className="text-subtle py-1">{key}</td>
      <td className="py-1">{getTextForValue(value)}</td>
    </tr>
  )
}

export function makeTable(payload) {
  const keys = Object.keys(payload)

  return (
    <table>
      <tbody>{keys.map(key => makeRow(key, payload[key]))}</tbody>
    </table>
  )
}
