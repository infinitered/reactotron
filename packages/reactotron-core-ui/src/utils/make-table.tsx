import React from "react"

// TODO: Pull over styling and such from makeTable in the current app
function makeRow(key, value) {
  return (
    <tr>
      <td>{key}</td>
      <td>{value}</td>
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
