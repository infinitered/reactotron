import React, { FunctionComponent } from "react"

import TimelineCommand from "../../components/TimelineCommand"
import makeTable from "../../utils/makeTable"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

interface ClientIntroPayload {
  name: string
}

interface Props extends TimelineCommandProps<ClientIntroPayload> {}

const ClientIntroCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="CONNECTION"
      preview={payload.name}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {makeTable(payload)}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(ClientIntroCommand)
export { ClientIntroCommand }
