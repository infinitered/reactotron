import React from "react"
import styled from "rn-css"
import isShallow from "../../utils/isShallow"
import makeTable from "../../utils/makeTable"
import TreeView from "../TreeView"

const NullContainer = styled.View`
  color: ${(props) => props.theme.tag};
`
const UndefinedContainer = styled.View`
  color: ${(props) => props.theme.tag};
`
const StringContainer = styled.View`
  color: ${(props) => props.theme.foreground};
  user-select: text;
  cursor: text;
`
const StringLineSpan = styled.Text``

interface Props {
  // value: object | string | number | boolean | null | undefined
  value: any
  treeLevel?: number
}

export default function ContentView({ value, treeLevel }: Props) {
  if (value === null) return <NullContainer>null</NullContainer>
  if (value === undefined) return <UndefinedContainer>undefined</UndefinedContainer>

  let checkValue
  try {
    checkValue = JSON.parse(value)
  } catch {
    checkValue = value
  }

  if (typeof checkValue === "string") {
    return (
      <StringContainer>
        {value
          .trim()
          .split("\\n")
          .map((part, idx) => (
            <StringLineSpan key={`span-${idx}`}>
              {part}
              <br />
            </StringLineSpan>
          ))}
      </StringContainer>
    )
  }

  if (typeof checkValue === "object") {
    return isShallow(checkValue) ? (
      makeTable(checkValue)
    ) : (
      <TreeView value={checkValue} level={treeLevel} />
    )
  }

  return <StringContainer>{String(checkValue)}</StringContainer>
}
