import React from "react"
import styled from "rn-css"

const RowContainer = styled.View`
  display: flex;
  justify-content: space-between;
  user-select: all;
  padding: 2px 0;
`
const KeyContainer = styled.View`
  width: 210px;
  padding-right: 10px;
  word-break: break-all;
  text-align: left;
  color: ${(props) => props.theme.foregroundDark};
  user-select: text;
  cursor: text;
`
interface ValueContainerProps {
  $value: any
}
const ValueContainer = styled.View<ValueContainerProps>`
  flex: 1;
  word-break: break-all;
  user-select: text;
  cursor: text;
  color: ${(props) => {
    if (props.$value === null || props.$value === undefined) return props.theme.tag
    switch (typeof props.$value) {
      case "boolean":
      case "number":
        return props.theme.constant
      case "string":
      default:
        return props.theme.foreground
    }
  }};
`

const NULL_TEXT = "null"
const UNDEFINED_TEXT = "undefined"
const TRUE_TEXT = "true"
const FALSE_TEXT = "false"

function textForValue(value: any) {
  if (value === null) return NULL_TEXT
  if (value === undefined) return UNDEFINED_TEXT
  if (typeof value === "boolean") return value ? TRUE_TEXT : FALSE_TEXT
  return value
}

// eslint-disable-next-line react/display-name
const makeTable = (obj: unknown) => {
  const input = obj !== null && typeof obj === "object" ? obj : {}
  const keys = Object.keys(input) ?? []

  return (
    <div>
      {keys.map((key) => {
        const value = input[key]

        const textValue = textForValue(value)

        return (
          <RowContainer key={key}>
            <KeyContainer>{key}</KeyContainer>
            <ValueContainer $value={value}>{textValue}</ValueContainer>
          </RowContainer>
        )
      })}
    </div>
  )
}

export default makeTable
