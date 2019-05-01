import { inject, observer } from "mobx-react"
import { addIndex, identity, isNil, map, reverse } from "ramda"
import React, { Component } from "react"
import getCommandComponent from "../Commands"
import Empty from "../Shared/EmptyState"
import AppStyles from "../Theme/AppStyles"
import TimelineHeader from "./TimelineHeader"
import { MdReorder } from "react-icons/md";

const mapIndexed = addIndex(map)

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  commands: {
    margin: 0,
    padding: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },

  categoryLabel: {
    color: "#606060",
    paddingLeft: 20,
    fontSize: 12,
    paddingTop: 10,
  },

  loadMore: {
    color: "#606060",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
}

@inject("session")
@observer
class Timeline extends Component {
  // fires when we will update
  componentWillUpdate() {
    const node = this.refs.commands
    // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
    // remember our height, position, and if we're at the top
    this.scrollHeight = node.scrollHeight
    this.scrollTop = node.scrollTop
    this.isPinned = this.scrollTop === 0
  }

  // fires after we did update
  componentDidUpdate() {
    // should we be pinned to top, let's not auto-scroll
    if (this.isPinned) return
    const node = this.refs.commands
    // scroll to the place we were before
    // TODO: this falls apart as we reach max queue size as the scrollHeight no longer changes
    node.scrollTop = this.scrollTop + node.scrollHeight - this.scrollHeight
  }

  renderEmpty() {
    return (
      <Empty icon={MdReorder} title="No Activity">
        <p>Once your app connects and starts sending events, they will appear here.</p>
      </Empty>
    )
  }

  renderItem = (command, index) => {
    const CommandComponent = getCommandComponent(command)
    if (isNil(CommandComponent)) return null

    // grab the commands (heads up --- they're in reverse order for display purposes)
    const { commands = [] } = this.props.session

    // is this the bottom one?
    const isLast = index == commands.length - 1

    // find the one before it
    const previousCommand = isLast ? null : commands[index + 1]

    // if we have a previous one, calculate the time difference
    const diff =
      previousCommand &&
      previousCommand.date &&
      command.date &&
      command.date.getTime() - previousCommand.date.getTime()
    // glitches in the matrix
    const deltaTime = isLast || diff < 0 ? 0 : diff

    return <CommandComponent deltaTime={deltaTime} key={command.messageId} command={command} />
  }

  render() {
    const { session } = this.props
    const { commands, ui } = session
    const isEmpty = commands.length === 0
    const reverseIf = ui.isTimelineOrderReversed ? reverse : identity

    return (
      <div style={Styles.container}>
        <TimelineHeader onFilter={this.onFilter} />
        {isEmpty && this.renderEmpty()}
        <div style={Styles.commands} ref="commands">
          {reverseIf(mapIndexed(this.renderItem, commands))}
        </div>
      </div>
    )
  }
}

export default Timeline
