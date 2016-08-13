import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import { isNil, equals, length, pipe, without, reject, map, contains, __, values } from 'ramda'
import makeTable from '../Shared/MakeTable'

const NULL_TEXT = '¯\\_(ツ)_/¯'
const ROOT_TEXT = '(root)'
const COMMAND_TITLE = 'STATE'
const UNKNOWN_MESSAGE = 'Not sure how to render this value'

const Styles = {
  path: {
    padding: '10px 0'
  },
  stringValue: {
    color: Colors.text,
    WebkitUserSelect: 'all',
    wordBreak: 'break-all'
  }
}

// all the values in this object are in our approved list of types?
const allValuesStatic = pipe(
  values,
  without([null, undefined]),
  map(x => typeof x),
  reject(contains(__, ['number', 'string', 'boolean'])),
  length,
  equals(0)
  )

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
        if (allValuesStatic(value)) {
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
      <Command command={command} title={COMMAND_TITLE} subtitle={pathText}>
        <div style={Styles.container}>
          {this.renderValue(value)}
        </div>
      </Command>
    )
  }
}

export default StateValuesResponseCommand
