import React from "react"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { Pressable } from "react-native"
import styled from "rn-css"

const Container = styled(Pressable)`
  cursor: pointer;
  flex-direction: row;
  padding: 5px 0;
`
const IconContainer = styled.View`
  padding-right: 10px;
`
const Label = styled.Text`
  color: ${(props) => props.theme.tag};
  font-family: ${(props) => props.theme.fontFamily};
`

interface Props {
  isChecked: boolean
  label: string
  onToggle: () => void
}

function Checkbox({ isChecked, label, onToggle }: Props) {
  const Icon = isChecked ? MdCheckBox : MdCheckBoxOutlineBlank

  return (
    <Container onPress={onToggle}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <Label>{label}</Label>
    </Container>
  )
}

export default Checkbox
