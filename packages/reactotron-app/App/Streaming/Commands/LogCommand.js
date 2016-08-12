import React, { Component, PropTypes } from 'react'
import Command from '../Command'
import ObjectTree from '../../Shared/ObjectTree'
import { map, trim, split } from 'ramda'
import Colors from '../../Theme/Colors'

const getName = level => {
  switch (level) {
    case 'debug': return 'DEBUG'
    case 'warn': return 'WARNING'
    case 'error': return 'ERROR'
    default: return 'LOG'
  }
}

const breakIntoSpans = (part) => {
  return (
    <span>{part}<br /></span>
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

  render () {
    const { command } = this.props
    const { payload } = command
    const { level } = payload
    const title = getName(level)
    let color
    switch (level) {
      case 'warn':
        color = Colors.warning
        break

      case 'error':
        color = Colors.error
        break

      default:
        color = Colors.Palette.almostBlack
    }

    return (
      <Command command={command} title={title} color={color}>
        <div style={Styles.container}>
          {formatMessage(payload.message)}
        </div>
      </Command>
    )
  }
}

export default LogCommand
