import React from "react"
import styled from "styled-components"

import { Row, Title, Text } from "./Shared"

import type { ChangeEvent } from "react"

const Input = styled.input`
  margin-right: 4px;
  width: 45px;
  border: 0;
  padding: 8px 5px;
  font-size: 1.1rem;
  background-color: ${(props) => props.theme.backgroundLight};
  color: ${(props) => props.theme.backgroundColor};
`

type OverlayMargin = "marginTop" | "marginLeft" | "marginBottom" | "marginRight"
type UpdatedMargin = {
  [key in OverlayMargin]?: number
} & {
  [key in OverlayMargin]: number
}

interface OverlayMarginsProps {
  marginTop?: number
  marginLeft?: number
  marginBottom?: number
  marginRight?: number
  onChange: (margin: UpdatedMargin) => void
}

export function OverlayMargins(props: OverlayMarginsProps) {
  const { marginTop, marginLeft, marginBottom, marginRight, onChange } = props

  const handleMarginChange =
    (whichMargin: OverlayMargin) => (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation()
      event.preventDefault()
      const newValue = Number(event.target.value || 0)
      const value = isNaN(newValue) ? 0 : newValue
      onChange({ [whichMargin]: value } as UpdatedMargin)
    }

  return (
    <div>
      <Title>Margins</Title>
      <div>
        <Row>
          <Text>Top</Text>
          <Input type="number" onChange={handleMarginChange("marginTop")} value={marginTop} />
          <Text>Right</Text>
          <Input type="number" onChange={handleMarginChange("marginRight")} value={marginRight} />
          <Text>Bottom</Text>
          <Input type="number" onChange={handleMarginChange("marginBottom")} value={marginBottom} />
          <Text>Left</Text>
          <Input type="number" onChange={handleMarginChange("marginLeft")} value={marginLeft} />
        </Row>
      </div>
    </div>
  )
}
