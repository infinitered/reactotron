import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import { isNil } from 'ramda'
import makeTable from '../Shared/MakeTable'
import isShallow from '../Lib/IsShallow'

const NULL_TEXT = '¯\\_(ツ)_/¯'
const ROOT_TEXT = '(root)'
const COMMAND_TITLE = 'STATE'
const UNKNOWN_MESSAGE = 'Not sure how to render this value'
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

  renderObject (value) {
    return <ObjectTree object={value} level={0} />
  }

  renderString (value) {
    return <div style={Styles.stringValue}>{value}</div>
  }

  renderTable (value) {
    return makeTable(value)
  }

  renderNull () {
    return NULL_TEXT
  }

  renderValue (value) {
    if (isNil(value)) {
      return this.renderNull()
    }
    switch (typeof value) {
      case 'object':
        if (isShallow(value)) {
          return this.renderTable(value)
        } else {
          return this.renderObject(value)
        }

      case 'string':
      case 'number':
        return this.renderString(value)

      default:
        return <div style={Styles.unknown}>{UNKNOWN_MESSAGE}</div>
    }
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
          {this.renderValue(value)}
        </div>
      </Command>
    )
  }
}

export default StateValuesResponseCommand
