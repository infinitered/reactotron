import React from "react"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import styled from "rn-css"

const Container = styled.View`
  display: flex;
  cursor: pointer;
  padding: 5px 0;
`
const IconContainer = styled.View`
  padding-right: 10px;
`
const Label = styled.Text`
  color: ${(props) => props.theme.tag};
`

interface Props {
  isChecked: boolean
  label: string
  onToggle: () => void
}

function Checkbox({ isChecked, label, onToggle }: Props) {
  const Icon = isChecked ? MdCheckBox : MdCheckBoxOutlineBlank

  return (
    <Container onClick={onToggle}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <Label>{label}</Label>
    </Container>
  )
}

export default Checkbox
