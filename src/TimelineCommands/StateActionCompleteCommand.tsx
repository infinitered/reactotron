import React from "react"
import styled from "styled-components"

import TimelineCommand from "../TimelineCommand"

import ContentView from "../ContentView"

const NameContainer = styled.div`
  color: ${props => props.theme.bold};
  padding-bottom: 10px;
`

interface Props {
  command: any
}

export default function StateActionCompleteCommand({ command }: Props) {
  const { payload, date, deltaTime } = command

  return (
    <TimelineCommand date={date} deltaTime={deltaTime} title="ACTION" preview={payload.name}>
      <NameContainer>{payload.name}</NameContainer>
      <ContentView value={payload.action} />
    </TimelineCommand>
  )
}
