// TODO: Name this better...
import React, { FunctionComponent } from "react"

import { ReactotronProvider, Command } from "./contexts/Reactotron"
import { TimelineProvider } from "./contexts/Timeline"

interface Props {
  commands: Command[]
}

const ReactotronBrain: FunctionComponent<Props> = ({ commands, children }) => {
  return (
    <ReactotronProvider commands={commands}>
      <TimelineProvider>{children}</TimelineProvider>
    </ReactotronProvider>
  )
}

export default ReactotronBrain
