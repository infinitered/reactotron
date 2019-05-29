import * as React from "react"
import ObjectTree from "../../../Shared/ObjectTree"
import { textForValue, colorForValue } from "../../../Shared/MakeTable"

export const OBJECT_TYPE = "jsobject"

const ObjectOutput = ({ content }) => {
  if (typeof content === "object") {
    return <ObjectTree object={{ value: content }} />
  }

  const color = colorForValue(content)

  return <div style={{ color }}>{textForValue(content)}</div>
}

export default {
  [OBJECT_TYPE]: ObjectOutput,
}
