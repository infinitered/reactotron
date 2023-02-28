import React from "react"

import { Title, Row } from "./Shared"
import { OverlayButton } from "./OverlayButton"

import type { MouseEvent } from "react"

interface OverlayOpacityProps {
  opacity?: number
  onChange: (opacity: number) => void
}

export function OverlayOpacity(props: OverlayOpacityProps) {
  const { opacity, onChange } = props

  const handleOpacityChange = (opacity: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    onChange(opacity)
  }

  return (
    <div>
      <Title>Opacity</Title>
      <div>
        <Row>
          <OverlayButton onClick={handleOpacityChange(0)} selected={opacity === 0} title={"0"} />
          <OverlayButton
            onClick={handleOpacityChange(0.1)}
            selected={opacity === 0.1}
            title={"0.1"}
          />
          <OverlayButton
            onClick={handleOpacityChange(0.25)}
            selected={opacity === 0.25}
            title={"0.25"}
          />
          <OverlayButton
            onClick={handleOpacityChange(0.5)}
            selected={opacity === 0.5}
            title={"0.5"}
          />
          <OverlayButton
            onClick={handleOpacityChange(0.75)}
            selected={opacity === 0.75}
            title={"0.75"}
          />
          <OverlayButton
            onClick={handleOpacityChange(0.9)}
            selected={opacity === 0.9}
            title={"0.9"}
          />
          <OverlayButton onClick={handleOpacityChange(1)} selected={opacity === 1} title={"1"} />
        </Row>
      </div>
    </div>
  )
}
