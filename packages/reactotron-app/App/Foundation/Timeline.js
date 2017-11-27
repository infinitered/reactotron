import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import getCommandComponent from '../Commands'
import TimelineHeader from './TimelineHeader'
import { map, isNil } from 'ramda'
import AppStyles from '../Theme/AppStyles'
import Empty from '../Foundation/EmptyState'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  commands: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  categoryLabel: {
    color: '#606060',
    paddingLeft: 20,
    fontSize: 12,
    paddingTop: 10
  },

  loadMore: {
    color: '#606060',
    textAlign: 'center',
    padding: 20,
    fontSize: 16
  }
}

@inject('session')
@observer
class Timeline extends Component {
  // fires when we will update
  componentWillUpdate () {
    const node = this.refs.commands
    // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
    // remember our height, position, and if we're at the top
    this.scrollHeight = node.scrollHeight
    this.scrollTop = node.scrollTop
    this.isPinned = this.scrollTop === 0
  }

  // fires after we did update
  componentDidUpdate () {
    // should we be pinned to top, let's not auto-scroll
    if (this.isPinned) return
    const node = this.refs.commands
    // scroll to the place we were before
    // TODO: this falls apart as we reach max queue size as the scrollHeight no longer changes
    node.scrollTop = this.scrollTop + node.scrollHeight - this.scrollHeight
  }

  renderEmpty () {
    return (
      <Empty icon='reorder' title='No Activity'>
        <p>Once your app connects and starts sending events, they will appear here.</p>
      </Empty>
    )
  }

  renderItem = command => {
    const CommandComponent = getCommandComponent(command)
    if (isNil(CommandComponent)) return null

    return <CommandComponent key={command.messageId} command={command} />
  }

  render () {
    const { session } = this.props
    const { commands } = session
    const isEmpty = commands.length === 0

    return (
      <div style={Styles.container}>
        <TimelineHeader onFilter={this.onFilter} />
        {isEmpty && this.renderEmpty()}
        <div style={Styles.commands} ref='commands'>
          {map(this.renderItem, commands)}
        </div>
      </div>
    )
  }
}

export default Timeline
