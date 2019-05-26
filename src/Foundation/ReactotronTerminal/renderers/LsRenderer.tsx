import * as React from "react"

export const LS_TYPE = "ls"

const LsOutput = ({ content }) => {
  return (
    <div>
      {content.map(a => (
        <div key={a}>{a}</div>
      ))}
    </div>
  )
}

export default {
  [LS_TYPE]: LsOutput,
}
