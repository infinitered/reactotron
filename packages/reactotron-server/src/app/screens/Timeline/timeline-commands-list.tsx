import React from "react"
import { TimelineCommand } from "reactotron-core-ui"
import { reactotronApp } from "../../reactotron-app"

interface Props {
  subscribeToCommands: Function
  commands: any[]
}

export class TimelineCommandsList extends React.Component<Props> {
  componentDidMount() {
    this.props.subscribeToCommands() // TODO: Do we gotta unsub?
  }

  renderCommand(command) {
    const timelineConfig = reactotronApp.getTimelineCommand(command.type)

    if (!timelineConfig) return null

    return (
      <TimelineCommand command={command} timelineConfig={timelineConfig} key={command.messageId} />
    )
  }

  render() {
    return this.props.commands.map(this.renderCommand)
  }
}
