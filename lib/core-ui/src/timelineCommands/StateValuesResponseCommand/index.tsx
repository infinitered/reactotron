import React, { FunctionComponent } from "react"
import styled from "styled-components"

import TimelineCommand from "../../components/TimelineCommand"
import ContentView from "../../components/ContentView"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

const PathLabel = styled.div`
  padding-bottom: 10px;
  color: ${props => props.theme.bold};
`

interface StateValuesResponsePayload {
  path?: string
  value: any
  valid: boolean
}

interface Props extends TimelineCommandProps<StateValuesResponsePayload> {}

const StateValuesResponseCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="STATE"
      preview=""
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <PathLabel>{payload.path || "(root)"}</PathLabel>
      <ContentView value={payload.value} />
    </TimelineCommand>
  )
}

export default buildTimelineCommand(StateValuesResponseCommand, true)
export { StateValuesResponseCommand }
