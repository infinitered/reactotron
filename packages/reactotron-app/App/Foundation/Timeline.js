import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Colors from '../Theme/Colors'
import getCommandComponent from '../Commands'
import { map, reverse } from 'ramda'
import { dotPath } from 'ramdasauce'
import AppStyles from '../Theme/AppStyles'

const Styles = {
  container: {
    backgroundColor: Colors.Palette.screen,
    ...AppStyles.Layout.vbox,
    padding: 0,
    margin: 0
  },
  commands: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
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
    // TODO: this falls apart as we reach max queue size as the scrollHeigh no longer changes
    node.scrollTop = this.scrollTop + node.scrollHeight - this.scrollHeight
  }

  render () {
    // grab the commands, but sdrawkcab
    const commands = reverse(dotPath('props.session.server.commands.all', this))

    const renderItem = command => {
      const CommandComponent = getCommandComponent(command)
      return <CommandComponent key={command.messageId} command={command} />
    }

    return (
      <div style={Styles.container} ref='container'>
        <div style={Styles.commands} ref='commands'>
          {map(renderItem, commands)}
        </div>
      </div>
    )
  }

}

export default Timeline
