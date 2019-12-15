import React from "react"
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  cursor: pointer;
  padding: 5px 0;
`
const IconContainer = styled.div`
  padding-right: 10px;
`
const Label = styled.span`
  color: ${props => props.theme.tag};
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
