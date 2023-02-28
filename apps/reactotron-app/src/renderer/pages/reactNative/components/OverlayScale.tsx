import React from "react"

import { Title, Row } from "./Shared"
import { OverlayButton } from "./OverlayButton"

import type { MouseEvent } from "react"

interface OverlayScaleProps {
  scale?: number
  onChange: (scale: number) => void
}

export function OverlayScale(props: OverlayScaleProps) {
  const { scale, onChange } = props

  const handleScaleChange = (scale: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    onChange(scale)
  }

  return (
    <div>
      <Title>Scale</Title>
      <div>
        <Row>
          <OverlayButton
            onClick={handleScaleChange(0.33)}
            selected={scale === 0.33}
            title={"1/3"}
          />
          <OverlayButton onClick={handleScaleChange(0.5)} selected={scale === 0.5} title={"1/2"} />
          <OverlayButton onClick={handleScaleChange(1)} selected={scale === 1} title={"1"} />
          <OverlayButton onClick={handleScaleChange(2)} selected={scale === 2} title={"2"} />
          <OverlayButton onClick={handleScaleChange(3)} selected={scale === 3} title={"3"} />
        </Row>
      </div>
    </div>
  )
}
