import React from "react"
import { GestureResponderEvent, Pressable } from "react-native"
import styled from "rn-css"

const Button = styled(Pressable)<{ selected: boolean }>`
  background-color: ${(props) => props.theme.subtleLine};
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.backgroundSubtleDark};
  cursor: pointer;
  height: 30px;
  margin-right: 4px;
  padding: "0 15px";
`

const ButtonText = styled.Text<{ selected: boolean }>`
  color: ${(props) => (props.selected ? props.theme.bold : props.theme.foregroundDark)};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 13px;
`

interface OverlayButtonProps {
  title: string
  selected?: boolean
  onClick: (event?: GestureResponderEvent) => void
}

export function OverlayButton(props: OverlayButtonProps) {
  const { selected, title, onClick } = props
  return (
    <Button selected={selected} onPress={onClick}>
      <ButtonText selected={selected}>{title}</ButtonText>
    </Button>
  )
}
