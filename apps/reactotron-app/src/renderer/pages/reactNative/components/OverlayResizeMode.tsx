import React from "react"

import { Title, Row } from "./Shared"
import { OverlayButton } from "./OverlayButton"

import type { MouseEvent } from "react"

export type ResizeMode = "cover" | "stretch" | "contain"

interface OverlayResizeModeProps {
  resizeMode?: ResizeMode
  onChange: (resizeMode: ResizeMode) => void
}

export function OverlayResizeMode(props: OverlayResizeModeProps) {
  const { resizeMode, onChange } = props

  const handleResizeChange = (resizeMode: ResizeMode) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    onChange(resizeMode)
  }

  return (
    <div>
      <Title>Resize Mode</Title>
      <div>
        <Row>
          <OverlayButton
            onClick={handleResizeChange("stretch")}
            selected={resizeMode === "stretch"}
            title={"Stretch"}
          />
          <OverlayButton
            onClick={handleResizeChange("cover")}
            selected={resizeMode === "cover"}
            title={"Cover"}
          />
          <OverlayButton
            onClick={handleResizeChange("contain")}
            selected={resizeMode === "contain"}
            title={"Contain"}
          />
        </Row>
      </div>
    </div>
  )
}
