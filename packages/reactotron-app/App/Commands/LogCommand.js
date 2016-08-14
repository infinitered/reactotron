import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import { merge, map, trim, split } from 'ramda'
import Colors from '../Theme/Colors'

const getName = level => {
  switch (level) {
    case 'debug': return 'DEBUG'
    case 'warn': return 'WARNING'
    case 'error': return 'ERROR'
    default: return 'LOG'
  }
}
let spanCount = 0
const breakIntoSpans = (part) => {
  spanCount++
  return (
    <span key={`span-${spanCount}`}>{part}<br /></span>
  )
}

const formatMessage = message => {
  if (typeof message === 'string') {
    return (
      <div>
        {map(breakIntoSpans, split('\n', trim(message)))}
      </div>
    )
  } else if (typeof message === 'object') {
    <ObjectTree object={{payload: message}} />
  }
}

const Styles = {
  container: {
    paddingTop: 4
  }
}

class LogCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { level } = payload
    const title = getName(level)
    const containerTypes = merge(Styles.container, { color: level === 'debug' ? Colors.foreground : Colors.warning })

    return (
      <Command command={command} title={title}>
        <div style={containerTypes}>
          {formatMessage(payload.message)}
        </div>
      </Command>
    )
  }
}

export default LogCommand
