import React from "react"
import { TimelineCommandRenderer } from "reactotron-core-ui"

import { getCommandRenderer } from "./commands"

interface Props {
  subscribeToCommands: Function
  commands: any[]
}

export class TimelineCommandsList extends React.Component<Props> {
  componentDidMount() {
    this.props.subscribeToCommands() // TODO: Do we gotta unsub?
  }

  renderCommand(command) {
    const renderer = getCommandRenderer(command)

    if (!renderer) return null

    return <TimelineCommandRenderer command={command} renderer={renderer} key={command.messageId} />
  }

  render() {
    return this.props.commands.map(this.renderCommand)
  }
}
