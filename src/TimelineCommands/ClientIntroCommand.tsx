import React from "react"

import TimelineCommand from "../TimelineCommand"
import makeTable from "../utils/makeTable"

interface Props {
  command: any // TODO: Type this better!
}

export default function ClientIntroCommand({ command }: Props) {
  const { payload, date, deltaTime } = command

  return (
    <TimelineCommand date={date} deltaTime={deltaTime} title="CONNECTION" preview={payload.name}>
      {makeTable(payload)}
    </TimelineCommand>
  )
}
