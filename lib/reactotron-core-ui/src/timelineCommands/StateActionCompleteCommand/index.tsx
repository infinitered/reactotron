import React, { FunctionComponent } from "react"
import { MdCode, MdRepeat } from "react-icons/md"
import styled from "rn-css"
import stringifyObject from "stringify-object"

import ContentView from "../../components/ContentView"
import TimelineCommand from "../../components/TimelineCommand"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

const NameContainer = styled.View`
  color: ${(props) => props.theme.bold};
  padding-bottom: 10px;
`

interface StateActionCompletePayload {
  name: string
  action: any
}

interface Props extends TimelineCommandProps<StateActionCompletePayload> {}

const StateActionCompleteCommand: FunctionComponent<Props> = ({
  command,
  isOpen,
  setIsOpen,
  dispatchAction,
  openDispatchDialog,
}) => {
  const { payload, date, deltaTime } = command

  const toolbar = []

  if (dispatchAction) {
    toolbar.push({
      icon: MdRepeat,
      onClick: () => {
        dispatchAction(payload.action)
      },
      tip: "Repeat this action.",
    })
  }

  if (openDispatchDialog) {
    toolbar.push({
      icon: MdCode,
      onClick: () => {
        openDispatchDialog(
          stringifyObject(payload.action, {
            indent: "  ",
            singleQuotes: true,
          })
        )
      },
      tip: "Edit and dispatch this action.",
    })
  }

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="ACTION"
      preview={payload.name}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      toolbar={toolbar}
    >
      <NameContainer>{payload.name}</NameContainer>
      <ContentView value={payload.action} />
    </TimelineCommand>
  )
}

export default buildTimelineCommand(StateActionCompleteCommand)
export { StateActionCompleteCommand }
