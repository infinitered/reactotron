// TODO: Name this better...
import React, { FunctionComponent } from "react"

import { ReactotronProvider, Command } from "./contexts/Reactotron"
import { TimelineProvider } from "./contexts/Timeline"
import { StateProvider } from "./contexts/State"

interface Props {
  commands: Command[]
  addCommandListener: (callback: (command: Command) => void) => void
}

const ReactotronBrain: FunctionComponent<Props> = ({ commands, addCommandListener, children }) => {
  return (
    <ReactotronProvider commands={commands} addCommandListener={addCommandListener}>
      <TimelineProvider>
        <StateProvider>{children}</StateProvider>
      </TimelineProvider>
    </ReactotronProvider>
  )
}

export default ReactotronBrain
