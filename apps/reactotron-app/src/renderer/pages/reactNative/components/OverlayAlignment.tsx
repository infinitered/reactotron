import React from "react"

import { OverlayAlignmentButton } from "./OverlayAlignmentButton"
import { Container, Row, Title } from "./Shared"

export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly"
export type AlignItems = "flex-start" | "flex-end" | "center" | "stretch" | "baseline"

interface OverlayAlignmentProps {
  selectedJustifyContent?: JustifyContent
  selectedAlignItems?: AlignItems
  onChange: (justifyContent: JustifyContent, alignItems: AlignItems) => void
}

export function OverlayAlignment({
  selectedJustifyContent,
  selectedAlignItems,
  onChange,
}: OverlayAlignmentProps) {
  return (
    // a 3x3 grid of 32px square buttons using styled-components
    <div>
      <Title>Alignment</Title>
      <Container>
        <Row>
          <OverlayAlignmentButton
            justifyContent="flex-start"
            alignItems="flex-start"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
          <OverlayAlignmentButton
            justifyContent="flex-start"
            alignItems="center"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
          <OverlayAlignmentButton
            justifyContent="flex-start"
            alignItems="flex-end"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
        </Row>
        <Row>
          <OverlayAlignmentButton
            justifyContent="center"
            alignItems="flex-start"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
          <OverlayAlignmentButton
            justifyContent="center"
            alignItems="center"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
          <OverlayAlignmentButton
            justifyContent="center"
            alignItems="flex-end"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
        </Row>
        <Row>
          <OverlayAlignmentButton
            justifyContent="flex-end"
            alignItems="flex-start"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
          <OverlayAlignmentButton
            justifyContent="flex-end"
            alignItems="center"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
          <OverlayAlignmentButton
            justifyContent="flex-end"
            alignItems="flex-end"
            selectedJustifyContent={selectedJustifyContent}
            selectedAlignItems={selectedAlignItems}
            onClick={onChange}
          />
        </Row>
      </Container>
    </div>
  )
}
