import React from "react"

import { Title, Row } from "./Shared"
import { OverlayButton } from "./OverlayButton"

import type { MouseEvent } from "react"

export enum Layout {
  Image = "Image",
  Screen = "Screen",
}

interface OverlayLayoutTypeProps {
  layoutType?: Layout
  onChange: (layoutType: Layout) => void
}

export function OverlayLayoutType(props: OverlayLayoutTypeProps) {
  const { layoutType, onChange } = props

  const handleLayoutChange = (layoutType: Layout) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    onChange(layoutType)
  }

  return (
    <div>
      <Title>Layout</Title>
      <div>
        <Row>
          <OverlayButton
            onClick={handleLayoutChange(Layout.Image)}
            selected={layoutType === Layout.Image}
            title={"Image"}
          />
          <OverlayButton
            onClick={handleLayoutChange(Layout.Screen)}
            selected={layoutType === Layout.Screen}
            title={"Screen"}
          />
        </Row>
      </div>
    </div>
  )
}
