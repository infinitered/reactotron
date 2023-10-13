import React, { FunctionComponent } from "react"
import styled from "styled-components"

interface ContainerProps {
  $isActive: boolean
}
const Container = styled.div.attrs(() => ({}))<ContainerProps>`
  display: flex;
  padding: 4px 8px;
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isActive ? props.theme.constant : props.theme.backgroundLighter};
  color: ${(props) => (props.$isActive ? props.theme.background : props.theme.foreground)};
  align-items: center;
  justify-content: center;
  text-align: center;
`

interface Props {
  isActive: boolean
  text: string
  onClick: () => void
}

const TimelineCommandTabButton: FunctionComponent<Props> = ({ isActive, text, onClick }) => {
  return (
    <Container $isActive={isActive} onClick={onClick}>
      {text}
    </Container>
  )
}

export default TimelineCommandTabButton
