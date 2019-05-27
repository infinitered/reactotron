import * as React from "react"
import { colorForValue } from "../../../Shared/MakeTable"

export const LS_TYPE = "ls"

const LsOutput = ({ content }) => {
  return (
    <div>
      {content.map(a => {
        const color = colorForValue(content)

        return (
          <div key={a} style={{ color }}>
            {a}
          </div>
        )
      })}
    </div>
  )
}

export default {
  [LS_TYPE]: LsOutput,
}
