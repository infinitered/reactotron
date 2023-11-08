import React from "react"
import styled from "rn-css"

const Button = styled.TouchableOpacity<{ selected: boolean }>`
  height: 30px;
  padding: "0 15px";
  font-size: 13px;
  margin-right: 4px;
  background-color: ${(props) => props.theme.subtleLine};
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.backgroundSubtleDark};
  cursor: pointer;
  color: ${(props) => (props.selected ? props.theme.bold : props.theme.foregroundDark)};
`

interface OverlayButtonProps {
  title: string
  selected?: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function OverlayButton(props: OverlayButtonProps) {
  const { selected, title, onClick } = props
  return (
    <Button selected={selected} onClick={onClick}>
      {title}
    </Button>
  )
}
