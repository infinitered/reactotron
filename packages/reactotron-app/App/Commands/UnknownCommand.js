import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'

const COMMAND_TITLE = 'MYSTERY 👻'

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
      <Command command={command} title={COMMAND_TITLE} subtitle={type}>
        <ObjectTree object={{payload}} />
      </Command>
    )
  }
}

export default UnknownCommand
