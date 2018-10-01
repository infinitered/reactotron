import React from "react"
import { TimelineCommandOptions, Command } from "reactotron-core-ui"

import { Timestamp } from "./timestamp"

interface Props {
  command: Command
  timelineConfig: TimelineCommandOptions
}

interface State {
  expanded: boolean
}

export class TimelineCommand extends React.Component<Props, State> {
  state = {
    expanded: false,
  }

  handleToggle = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }))
  }

  render() {
    const { command, timelineConfig } = this.props
    const { expanded } = this.state

    const PreviewComponent = timelineConfig.preview
    const BodyComponent = timelineConfig.component

    // Ok. So this is awful. I know there is a better way of handling this
    // with tailwind and flexbox, but I have no idea what it is.
    // So for the minute, please embrace the hack. Sorry!
    const style = {
      minHeight: "10%"
    };

    return (
      <div className="bg-content border flex flex-col min-h-full" style={style}>
        <div className="flex flex-row cursor-pointer p-6" onClick={this.handleToggle}>
          <div className="flex-1">
            <Timestamp date={command.date} deltaTime={command.deltaTime} />
          </div>
          <div className="flex-1 text-orange">{timelineConfig.type}</div>
          {!expanded && (
            <div className="flex-grow">
              {PreviewComponent && <PreviewComponent command={command} />}
            </div>
          )}
          <div className="px-2">&#62;</div>
        </div>
        {expanded &&
          BodyComponent && (
            <div>
              <BodyComponent command={command} />
            </div>
          )}
      </div>
    )
  }
}
