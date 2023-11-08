import React, { type MouseEvent } from "react"
import styled from "rn-css"

interface OverlayAlignmentButtonProps {
  justifyContent: string
  alignItems: string
  selectedJustifyContent: string
  selectedAlignItems: string
  onClick: (justifyContent: string, alignItems: string) => void
}

const Button = styled.TouchableOpacity<{ selected: boolean }>`
  height: 32px;
  width: 32px;
  background-color: ${(props) => (props.selected ? props.theme.bold : props.theme.subtleLine)};
  border-radius: 2px;
  border: 1px solid ${(props) => (props.selected ? props.theme.bold : props.theme.subtleLine)};
  margin: 3px;
`

export function OverlayAlignmentButton(props: OverlayAlignmentButtonProps) {
  const { justifyContent, alignItems, selectedJustifyContent, selectedAlignItems } = props
  const isSelected = justifyContent === selectedJustifyContent && alignItems === selectedAlignItems

  const handleAlignmentChange =
    (justifyContent: string, alignItems: string) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      event.preventDefault()
      props.onClick(justifyContent, alignItems)
    }

  return (
    <Button selected={isSelected} onClick={handleAlignmentChange(justifyContent, alignItems)} />
  )
}
