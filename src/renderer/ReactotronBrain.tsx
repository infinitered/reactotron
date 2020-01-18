// TODO: Name this better...
import React, { FunctionComponent } from "react"

import { ReactotronProvider, Command } from "./contexts/Reactotron"
import { TimelineProvider } from "./contexts/Timeline"
import { StateProvider } from "./contexts/State"

interface Props {
  commands: Command[]
}

const ReactotronBrain: FunctionComponent<Props> = ({ commands, children }) => {
  return (
    <ReactotronProvider commands={commands}>
      <TimelineProvider>
        <StateProvider>{children}</StateProvider>
      </TimelineProvider>
    </ReactotronProvider>
  )
}

export default ReactotronBrain
