import React, { FunctionComponent } from "react"

import TimelineCommand from "../../TimelineCommand"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"
import ContentView from "../../ContentView"

interface StateValuesChangePayload {
  added: any
  changed: any
  changes: any[]
  removed: any
}

interface Props extends TimelineCommandProps<StateValuesChangePayload> {}

const StateValuesChangeCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  const hasChanged = !!payload.changed && !Array.isArray(payload.changed)
  const hasAdded = !!payload.added && !Array.isArray(payload.added)
  const hasRemoved = !!payload.removed && !Array.isArray(payload.removed)

  const changes = []

  if (hasChanged) {
    changes.push(`${Object.keys(payload.changed).length} changed`)
  }

  if (hasAdded) {
    changes.push(`${Object.keys(payload.added).length} added`)
  }

  if (hasRemoved) {
    changes.push(`${Object.keys(payload.removed).length} removed`)
  }

  const preview = changes.join(" ")

  // TODO: What should we do about this null junk?
  // TODO: Consider only showing the labels if more then 1 type is there?

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="SUBSCRIPTIONS"
      preview={preview}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {hasChanged && <ContentView value={{ changed: payload.changed.null }} />}
      {hasAdded && <ContentView value={{ "+ added": payload.added.null }} />}
      {hasRemoved && <ContentView value={{ "- removed": payload.removed.null }} />}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(StateValuesChangeCommand, true)
export { StateValuesChangeCommand }
