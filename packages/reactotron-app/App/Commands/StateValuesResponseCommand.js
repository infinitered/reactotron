import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import { isNil, equals, length, pipe, without, reject, map, contains, __, values } from 'ramda'
import makeTable from '../Shared/MakeTable'

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
    return '¯\\_(ツ)_/¯'
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
        return <div style={Styles.unknown}>Not sure how to render this value</div>
    }
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { path, value } = payload
    const pathText = path || '(root)'

    return (
      <Command command={command} title='STATE' subtitle={pathText}>
        <div style={Styles.container}>
          {this.renderValue(value)}
        </div>
      </Command>
    )
  }
}

export default StateValuesResponseCommand
