import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'

class UnknownCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload, type } = command

    return (
      <Command command={command} title='MYSTERY 👻' subtitle={type} color={Colors.Palette.matteBlack}>
        <ObjectTree object={{payload}} />
      </Command>
    )
  }
}

export default UnknownCommand
