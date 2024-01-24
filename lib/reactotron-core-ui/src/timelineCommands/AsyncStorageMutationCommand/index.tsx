import React, { FunctionComponent } from "react"

import TimelineCommand from "../../components/TimelineCommand"
import { KeyContainer, RowContainer, ValueContainer } from "../../utils/makeTable"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"
import { makeTableWithContentView } from "../../components/ContentView"

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
      {payload.action && (
        <RowContainer key={"action"}>
          <KeyContainer>action</KeyContainer>
          <ValueContainer $value={payload.action}>{payload.action}</ValueContainer>
        </RowContainer>
      )}
      {makeTableWithContentView(payload.data)}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(AsyncStorageMutationCommand)
export { AsyncStorageMutationCommand }
