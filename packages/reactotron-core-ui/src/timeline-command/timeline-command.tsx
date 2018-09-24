import React from "react"

import { Timestamp } from "./timestamp"

// TODO: Move this?
export abstract class TimelineCommand {
  protected command: any

  constructor(command) {
    this.command = command
  }

  abstract getType(): string
  abstract getSummary(): any
  abstract getBody(): any
}

interface Props {
  command: any
  renderer: TimelineCommand
}

interface State {
  expanded: boolean
}

export class TimelineCommandRenderer extends React.Component<Props, State> {
  state = {
    expanded: false,
  }

  handleToggle = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }))
  }

  render() {
    const { command, renderer } = this.props
    const { expanded } = this.state

    return (
      <div className="bg-content border flex flex-col">
        <div className="flex flex-row cursor-pointer p-6" onClick={this.handleToggle}>
          <div className="flex-1">
            <Timestamp date={command.date} deltaTime={command.deltaTime} />
          </div>
          <div className="flex-1 text-orange">{renderer.getType()}</div>
          {!expanded && <div className="flex-grow">{renderer.getSummary()}</div>}
          <div className="px-2">&#62;</div>
        </div>
        {expanded && <div>{renderer.getBody()}</div>}
      </div>
    )
  }
}
