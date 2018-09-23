import React from "react"

import { getCommand } from "./commands"

interface Props {
  subscribeToCommands: Function
  commands: any[]
}

export class TimelineCommandsList extends React.Component<Props> {
  componentDidMount() {
    this.props.subscribeToCommands() // TODO: Do we gotta unsub?
  }

  renderCommand(command) {
    const CommandComponent = getCommand(command.type)

    if (!CommandComponent) return null

    return <CommandComponent command={command} key={command.messageId} />
  }

  render() {
    return this.props.commands.map(this.renderCommand)
  }
}
