import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import isShallow from '../Lib/IsShallow'
import makeTable from '../Shared/MakeTable'

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

  renderContent (action) {
    return isShallow ? makeTable(action) : <ObjectTree object={{action}} />
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
          {this.renderContent(action)}
        </div>
      </Command>
    )
  }
}

export default StateActionComplete
