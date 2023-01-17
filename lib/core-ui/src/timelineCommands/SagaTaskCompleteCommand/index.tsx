import React, { FunctionComponent, useState } from "react"

import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

import StatelessSagaTaskCompleteCommand, { SagaTaskCompletePayload } from "./Stateless"

interface Props extends TimelineCommandProps<SagaTaskCompletePayload> {}

const SagaTaskCompleteCommand: FunctionComponent<Props> = props => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <StatelessSagaTaskCompleteCommand
      {...props}
      isDetailsOpen={isDetailsOpen}
      setIsDetailsOpen={setIsDetailsOpen}
    />
  )
}

export default buildTimelineCommand(SagaTaskCompleteCommand)
export { SagaTaskCompleteCommand }
