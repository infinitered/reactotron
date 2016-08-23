import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import Content from '../Shared/Content'

const COMMAND_TITLE = 'ACTION'

const Styles = {
  name: {
    color: Colors.bold,
    margin: 0,
    paddingBottom: 10
  }
}

class StateActionComplete extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { ms, action, name } = payload
    const preview = `${name}`

    return (
      <Command command={command} title={COMMAND_TITLE} duration={ms} preview={preview}>
        <div style={Styles.container}>
          <div style={Styles.name}>{name}</div>
          <Content value={action} />
        </div>
      </Command>
    )
  }
}

export default StateActionComplete
