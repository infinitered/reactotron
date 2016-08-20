import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import isShallow from '../Lib/IsShallow'
import makeTable from '../Shared/MakeTable'
import { map, fromPairs } from 'ramda'

const COMMAND_TITLE = 'SUBSCRIPTIONS'

const Styles = {
  name: {
    color: Colors.bold,
    margin: 0,
    paddingBottom: 10
  }
}

class StateValuesChangeCommand extends Component {

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
    const changes = map(change => ([change.path, change.value]), this.props.command.payload.changes)
    const changeObject = fromPairs(changes)
    const preview = null // `${changes.length} change${changes.length !== 1 && 's'}`

    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.container}>
          <div style={Styles.name}>{name}</div>
          {this.renderContent(changeObject)}
        </div>
      </Command>
    )
  }
}

export default StateValuesChangeCommand
