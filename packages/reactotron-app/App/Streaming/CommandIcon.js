import React, { Component, PropTypes } from 'react'
import BenchmarkIcon from 'react-icons/lib/md/assignment-turned-in'
import DebugIcon from 'react-icons/lib/md/info'
import WarningIcon from 'react-icons/lib/md/warning'
import ErrorIcon from 'react-icons/lib/md/error'
import ActionIcon from 'react-icons/lib/md/check-box'
import UnknownIcon from 'react-icons/lib/md/block'
import Colors from '../Theme/Colors'

const Styles = {
  container: {

  },
  iconColor: Colors.Palette.grey,
  iconSize: 40
}

const benchmark = <BenchmarkIcon size={Styles.iconSize} color={Styles.iconColor} />
const debug = <DebugIcon size={Styles.iconSize} color={Styles.iconColor} />
const warning = <WarningIcon size={Styles.iconSize} color={Styles.iconColor} />
const error = <ErrorIcon size={Styles.iconSize} color={Styles.iconColor} />
const action = <ActionIcon size={Styles.iconSize} color={Styles.iconColor} />
const unknown = <UnknownIcon size={Styles.iconSize} color={Styles.iconColor} />

const getIcon = (command) => {
  const { type, payload } = command

  switch (type) {
    case 'benchmark.report': return benchmark
    case 'state.action.complete': return action
    case 'log':
      const { level } = payload
      switch (level) {
        case 'warn': return warning
        case 'error': return error
        default: return debug
      }

    default: return unknown
  }
}

class CommandIcon extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  render () {
    const { command } = this.props
    const icon = getIcon(command)

    return (
      <div style={Styles.container}>
        {icon}
      </div>
    )
  }
}

export default CommandIcon
