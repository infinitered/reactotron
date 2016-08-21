import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import Content from '../Shared/Content'

const ROOT_TEXT = '(root)'
const COMMAND_TITLE = 'STATE'
const PATH_LABEL = ''

const Styles = {
  path: {
    padding: '0 0 10px 0',
    color: Colors.bold
  },
  pathLabel: {
    color: Colors.foregroundDark
  },
  stringValue: {
    WebkitUserSelect: 'all',
    wordBreak: 'break-all'
  }
}

class StateValuesResponseCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { path, value } = payload
    const pathText = path || ROOT_TEXT

    return (
      <Command command={command} title={COMMAND_TITLE} startsOpen>
        <div style={Styles.container}>
          <div style={Styles.path}><span style={Styles.pathLabel}>{PATH_LABEL}</span> {pathText}</div>
          <Content value={value} />
        </div>
      </Command>
    )
  }
}

export default StateValuesResponseCommand
