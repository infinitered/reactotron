import React, { FunctionComponent } from "react"
import styled from "styled-components"

import TimelineCommand from "../../TimelineCommand"
import ContentView from "../../ContentView"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

const NameContainer = styled.div`
  color: ${props => props.theme.bold};
  padding-bottom: 10px;
`

interface StateActionCompletePayload {
  name: string
  action: any
}

interface Props extends TimelineCommandProps<StateActionCompletePayload> {}

const StateActionCompleteCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="ACTION"
      preview={payload.name}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <NameContainer>{payload.name}</NameContainer>
      <ContentView value={payload.action} />
    </TimelineCommand>
  )
}

export default buildTimelineCommand(StateActionCompleteCommand)
export { StateActionCompleteCommand }
