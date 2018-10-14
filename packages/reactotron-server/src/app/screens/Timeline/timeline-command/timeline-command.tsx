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

  shouldComponentUpdate(nextProps, nextState) {
    // This is a quick hack to stop rerendering every command just because a new one came in.
    // There is no way for a commands data to change so the only change we expect is if the state changed.
    return this.state.expanded !== nextState.expanded
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
      // minHeight: "10%"
    }

    return (
      <div className="border-b flex flex-col" style={style}>
        <div className="flex flex-row cursor-pointer py-4" onClick={this.handleToggle}>
          <div className="w-24">
            <Timestamp date={command.date} />
          </div>
          <div className="w-24 text-subtle text-right ">+{command.deltaTime} ms</div>
          <div className="w-64 pl-4 text-highlight">{timelineConfig.type}</div>
          {!expanded && (
            <div className="flex-grow">
              {PreviewComponent && <PreviewComponent command={command} />}
            </div>
          )}
          {expanded && <div className="flex-grow" />}
          <div className="px-2">&#62;</div>
        </div>
        {expanded &&
          BodyComponent && (
            <div className="p-4">
              <BodyComponent command={command} />
            </div>
          )}
      </div>
    )
  }
}
