import React, { FunctionComponent } from "react"

import TimelineCommand from "../../TimelineCommand"
import makeTable from "../../utils/makeTable"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

interface AsyncStorageMutationPayload {
  action: string
  data: any
}

interface Props extends TimelineCommandProps<AsyncStorageMutationPayload> {}

const AsyncStorageMutationCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  let preview = payload.action

  if (["setItem", "removeItem", "mergeItem"].indexOf(payload.action) > -1) {
    preview = `${payload.action}: ${payload.data.key}`
  }

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="ASYNC STORAGE"
      preview={preview}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {makeTable(payload.data)}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(AsyncStorageMutationCommand)
export { AsyncStorageMutationCommand }
