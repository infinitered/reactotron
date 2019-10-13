import React, { FunctionComponent, useState } from "react"

import StatelessTimelineCommand from "./Stateless"

interface Props {
  date: Date | number
  deltaTime?: number
  title: string
  preview: string
  renderToolbar?: () => any
}

const TimelineCommand: FunctionComponent<Props> = props => {
  const [isOpen, setIsOpen] = useState(false)

  return <StatelessTimelineCommand {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
}

export default TimelineCommand
