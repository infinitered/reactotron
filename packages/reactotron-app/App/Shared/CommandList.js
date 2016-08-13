import { reverse, map } from 'ramda'
import { observer, inject } from 'mobx-react'
import React, { Component } from 'react'
import getCommandComponent from '../Commands'

const Styles = {
  container: {
    paddingTop: 0,
    paddingBottom: 20
  },
  message: {
  },
  level: {
  }
}

@inject('session')
@observer
class CommandList extends Component {

  static propTypes = {
  }

  render () {
    const { server } = this.props.session
    const all = reverse(server.commands.all)
    const renderItem = command => {
      const CommandComponent = getCommandComponent(command)
      return <CommandComponent key={command.messageId} command={command} />
    }
    return (
      <div style={Styles.container}>
        {map(renderItem, all)}
      </div>
    )
  }

}

export default CommandList
